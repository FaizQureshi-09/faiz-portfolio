"""
AWS Lambda handler for the generic "/email-sender" API.

Accepts a JSON payload (to_email, subject, body, attachments [optional])
from an API Gateway POST endpoint and sends a plain-text email via SMTP
from FROM_EMAIL. Requires a matching x-api-key header on every request.

Required environment variables:
    FROM_EMAIL                   - Verified sender address used in the "From" header.
    SMTP_HOST                    - SMTP server hostname (e.g. an SES SMTP endpoint or Gmail).
    SMTP_USER                    - SMTP auth username.
    SMTP_PASSWORD_SSM_PARAMETER  - Name of the SSM SecureString parameter holding the
                                    SMTP auth password / app password.
    API_KEY_SSM_PARAMETER        - Name of the SSM SecureString parameter holding the
                                    API key clients must send in the x-api-key header.

Optional environment variables:
    SMTP_PORT          - SMTP port. Defaults to 465 (implicit TLS).
    CORS_ALLOW_ORIGIN  - Value for Access-Control-Allow-Origin. Defaults to "*".
"""

import base64
import binascii
import json
import logging
import os
import re
import smtplib
import unicodedata
from email.message import EmailMessage
from email.utils import formatdate

import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]"
    r"(?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?"
    r"(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
)

REQUIRED_FIELDS = ("to_email", "subject", "body")
MAX_SUBJECT_LENGTH = 500
MAX_BODY_LENGTH = 20000
MAX_ATTACHMENTS = 5
MAX_ATTACHMENT_BYTES = 6 * 1024 * 1024  # 6 MB per attachment (API Gateway payload limit is 10MB total)
MAX_TOTAL_ATTACHMENT_BYTES = 9 * 1024 * 1024


class ValidationError(Exception):
    """Raised when the incoming payload fails validation."""


class AuthError(Exception):
    """Raised when the request's API key is missing or incorrect."""


def _cors_headers():
    """Build the CORS headers shared by every response."""
    return {
        "Access-Control-Allow-Origin": os.environ.get("CORS_ALLOW_ORIGIN", "*"),
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type,x-api-key",
    }


def build_response(status_code, success, message, data=None):
    """
    Build a uniform API Gateway proxy response.

    Args:
        status_code (int): HTTP status code to return.
        success (bool): Whether the request was handled successfully.
        message (str): Human-readable summary of the result.
        data (dict | None): Optional extra payload for successful responses.

    Returns:
        dict: API Gateway Lambda proxy integration response.
    """
    body = {"success": success, "message": message}
    if data is not None:
        body["data"] = data

    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json", **_cors_headers()},
        "body": json.dumps(body),
    }


def parse_request_body(event):
    """
    Extract and JSON-decode the request body from an API Gateway event.

    Args:
        event (dict): The Lambda proxy integration event.

    Returns:
        dict: The decoded JSON body.

    Raises:
        ValidationError: If the body is missing or not valid JSON.
    """
    raw_body = event.get("body")
    if raw_body is None or raw_body == "":
        raise ValidationError("Request body is missing.")

    if event.get("isBase64Encoded"):
        raw_body = base64.b64decode(raw_body).decode("utf-8")

    try:
        payload = json.loads(raw_body)
    except (TypeError, json.JSONDecodeError) as exc:
        raise ValidationError("Request body must be valid JSON.") from exc

    if not isinstance(payload, dict):
        raise ValidationError("Request body must be a JSON object.")

    return payload


def is_valid_email(email):
    """Return True if the given string looks like a valid email address."""
    return bool(EMAIL_REGEX.match(email))


def _get_header(event, name):
    """Case-insensitively look up a header from an API Gateway proxy event."""
    headers = event.get("headers") or {}
    lowered = {key.lower(): value for key, value in headers.items()}
    return lowered.get(name.lower())


def _clean_credential(value):
    """
    Normalize a credential pulled from the environment or SSM.

    Values copied from web pages (e.g. an SMTP app password) can carry a
    non-breaking space (U+00A0) instead of a regular space, which
    smtplib's AUTH PLAIN/LOGIN encoders fail to ascii-encode. NFKC
    normalization collapses those into regular spaces.
    """
    return unicodedata.normalize("NFKC", value).strip()


_ssm_client = None
_smtp_password_cache = None
_api_key_cache = None


def _get_ssm_parameter(parameter_name):
    """Fetch a SecureString parameter from SSM."""
    global _ssm_client
    if _ssm_client is None:
        _ssm_client = boto3.client("ssm")
    response = _ssm_client.get_parameter(Name=parameter_name, WithDecryption=True)
    return _clean_credential(response["Parameter"]["Value"])


def _get_smtp_password():
    """Fetch and cache the SMTP password from its SSM SecureString parameter."""
    global _smtp_password_cache
    if _smtp_password_cache is None:
        _smtp_password_cache = _get_ssm_parameter(os.environ["SMTP_PASSWORD_SSM_PARAMETER"])
    return _smtp_password_cache


def _get_api_key():
    """Fetch and cache the expected API key from its SSM SecureString parameter."""
    global _api_key_cache
    if _api_key_cache is None:
        _api_key_cache = _get_ssm_parameter(os.environ["API_KEY_SSM_PARAMETER"])
    return _api_key_cache


def authenticate_request(event):
    """
    Verify the caller supplied the correct x-api-key header.

    Raises:
        AuthError: If the header is missing or doesn't match the configured key.
    """
    supplied_key = _get_header(event, "x-api-key")
    if not supplied_key or supplied_key != _get_api_key():
        raise AuthError("Missing or invalid API key.")


def validate_attachment(attachment, index):
    """
    Validate and normalize a single attachment entry.

    Args:
        attachment (dict): Raw attachment entry with filename, content_base64,
            and optionally content_type.
        index (int): Position in the attachments list, for error messages.

    Returns:
        dict: Normalized attachment with keys filename, content (bytes),
              content_type.

    Raises:
        ValidationError: If the attachment is malformed or too large.
    """
    if not isinstance(attachment, dict):
        raise ValidationError(f"Attachment at index {index} must be an object.")

    filename = attachment.get("filename")
    if not isinstance(filename, str) or not filename.strip():
        raise ValidationError(f"Attachment at index {index} requires a non-empty 'filename'.")

    content_base64 = attachment.get("content_base64")
    if not isinstance(content_base64, str) or not content_base64.strip():
        raise ValidationError(f"Attachment at index {index} requires 'content_base64'.")

    try:
        content = base64.b64decode(content_base64, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise ValidationError(f"Attachment at index {index} has invalid base64 content.") from exc

    if len(content) > MAX_ATTACHMENT_BYTES:
        raise ValidationError(
            f"Attachment at index {index} exceeds the maximum size of "
            f"{MAX_ATTACHMENT_BYTES // (1024 * 1024)} MB."
        )

    content_type = attachment.get("content_type")
    if not isinstance(content_type, str) or not content_type.strip():
        content_type = "application/octet-stream"

    return {"filename": filename.strip(), "content": content, "content_type": content_type.strip()}


def validate_payload(payload):
    """
    Validate and normalize the generic email payload.

    Args:
        payload (dict): Raw JSON payload with to_email, subject, body,
            and optionally attachments and cc_email.

    Returns:
        dict: Normalized fields with keys to_email, subject, body,
              cc_email (empty string if not provided), attachments (list).

    Raises:
        ValidationError: If a required field is missing, empty, too long,
            an email address is malformed, or an attachment is invalid.
    """
    for field in REQUIRED_FIELDS:
        value = payload.get(field)
        if not isinstance(value, str) or not value.strip():
            raise ValidationError(f"Field '{field}' is required.")

    to_email = payload["to_email"].strip()
    subject = payload["subject"].strip()
    body = payload["body"]

    if not is_valid_email(to_email):
        raise ValidationError("Field 'to_email' must be a valid email address.")
    if len(subject) > MAX_SUBJECT_LENGTH:
        raise ValidationError("Field 'subject' exceeds the maximum allowed length.")
    if len(body) > MAX_BODY_LENGTH:
        raise ValidationError("Field 'body' exceeds the maximum allowed length.")

    cc_email = payload.get("cc_email")
    cc_email = cc_email.strip() if isinstance(cc_email, str) else ""
    if cc_email and not is_valid_email(cc_email):
        raise ValidationError("Field 'cc_email' must be a valid email address.")

    raw_attachments = payload.get("attachments") or []
    if not isinstance(raw_attachments, list):
        raise ValidationError("Field 'attachments' must be a list.")
    if len(raw_attachments) > MAX_ATTACHMENTS:
        raise ValidationError(f"A maximum of {MAX_ATTACHMENTS} attachments is allowed.")

    attachments = [validate_attachment(a, i) for i, a in enumerate(raw_attachments)]
    total_bytes = sum(len(a["content"]) for a in attachments)
    if total_bytes > MAX_TOTAL_ATTACHMENT_BYTES:
        raise ValidationError(
            f"Total attachment size exceeds the maximum of "
            f"{MAX_TOTAL_ATTACHMENT_BYTES // (1024 * 1024)} MB."
        )

    return {
        "to_email": to_email,
        "subject": subject,
        "body": body,
        "cc_email": cc_email,
        "attachments": attachments,
    }


def build_email_message(from_email, fields):
    """
    Build a plain-text MIME email message, with any attachments, ready to
    be sent over SMTP.

    Args:
        from_email (str): Sender address.
        fields (dict): Normalized fields as returned by validate_payload.

    Returns:
        EmailMessage: The composed message.
    """
    message = EmailMessage()
    message["Subject"] = fields["subject"]
    message["From"] = from_email
    message["To"] = fields["to_email"]
    if fields["cc_email"]:
        message["Cc"] = fields["cc_email"]
    message["Date"] = formatdate(localtime=True)
    message.set_content(fields["body"])

    for attachment in fields["attachments"]:
        maintype, _, subtype = attachment["content_type"].partition("/")
        if not subtype:
            maintype, subtype = "application", "octet-stream"
        message.add_attachment(
            attachment["content"],
            maintype=maintype,
            subtype=subtype,
            filename=attachment["filename"],
        )

    return message


def send_email(message):
    """
    Send one composed email message over SMTP.

    Uses SMTP_SSL (implicit TLS, port 465) rather than STARTTLS to skip an
    extra plaintext round trip, matching the contact-form Lambda's approach.

    Args:
        message (EmailMessage): The message to send.

    Raises:
        smtplib.SMTPException: If the SMTP server rejects the connection,
            authentication, or the message itself.
        OSError: If the connection to the SMTP server fails.
    """
    smtp_host = _clean_credential(os.environ["SMTP_HOST"])
    smtp_port = int(os.environ.get("SMTP_PORT", "465"))
    smtp_user = _clean_credential(os.environ["SMTP_USER"])
    smtp_password = _get_smtp_password()

    server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10)
    try:
        server.login(smtp_user, smtp_password)
        server.send_message(message)
    finally:
        server.close()


def lambda_handler(event, context):
    """
    Entry point for the generic email-sender Lambda.

    Authenticates the request via x-api-key, parses and validates the
    payload, builds a plain-text email (with optional attachments), sends
    it via SMTP, and returns a uniform API Gateway response.

    Args:
        event (dict): API Gateway Lambda proxy integration event.
        context (LambdaContext): Lambda runtime context (unused).

    Returns:
        dict: API Gateway Lambda proxy integration response.
    """
    http_method = event.get("httpMethod") or event.get("requestContext", {}).get(
        "http", {}
    ).get("method")

    if http_method == "OPTIONS":
        logger.info("Responding to CORS preflight request.")
        return build_response(200, True, "OK")

    try:
        authenticate_request(event)

        payload = parse_request_body(event)
        fields = validate_payload(payload)
        logger.info(
            "Sending email to %s (%d attachment(s))", fields["to_email"], len(fields["attachments"])
        )

        from_email = os.environ["FROM_EMAIL"]
        message = build_email_message(from_email, fields)
        send_email(message)

        logger.info("Email sent successfully to %s", fields["to_email"])
        return build_response(200, True, "Email sent successfully.")

    except AuthError as exc:
        logger.warning("Authentication failed: %s", exc)
        return build_response(401, False, str(exc))

    except ValidationError as exc:
        logger.warning("Validation failed for email request: %s", exc)
        return build_response(400, False, str(exc))

    except KeyError as exc:
        logger.error("Missing required environment variable: %s", exc)
        return build_response(500, False, "Server configuration error.")

    except (smtplib.SMTPException, OSError) as exc:
        logger.error("Failed to send email: %s", exc)
        return build_response(502, False, "Failed to send the email. Please try again later.")

    except Exception as exc:  # noqa: BLE001 - final safety net for an API response
        logger.error("Unexpected error while sending email: %s", exc)
        return build_response(500, False, "An unexpected error occurred.")
