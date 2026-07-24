"""
AWS Lambda handler for the portfolio's "Contact Us" form.

Receives a JSON payload (name, email, phone [optional], message) from an
API Gateway POST endpoint, renders it into an HTML email template and
sends it via SMTP from FROM_EMAIL to TO_EMAIL. It then asynchronously
invokes itself to send an auto-reply (revert-back.html) from FROM_EMAIL to
the submitter's own email address — that second SMTP session happens in a
separate, decoupled invocation so it never adds to the caller's latency.

Required environment variables:
    FROM_EMAIL                   - Verified sender address used in the "From" header.
    TO_EMAIL                     - Inbox that receives contact form submissions.
    SMTP_HOST                    - SMTP server hostname (e.g. an SES SMTP endpoint or Gmail).
    SMTP_USER                    - SMTP auth username.
    SMTP_PASSWORD_SSM_PARAMETER  - Name of the SSM SecureString parameter holding the
                                    SMTP auth password / app password.

Optional environment variables:
    SMTP_PORT          - SMTP port. Defaults to 465 (implicit TLS).
    CORS_ALLOW_ORIGIN  - Value for Access-Control-Allow-Origin. Defaults to "*".
"""

import html
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
# Phone is submitted as "<dial code> <national number>", e.g. "+91 9876543210" —
# a "+" plus dial code, a space, then up to 10 digits.
PHONE_REGEX = re.compile(r"^\+[1-9]\d{0,3} \d{1,10}$")
TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "email_template.html")
REVERT_TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "revert-back.html")

REQUIRED_FIELDS = ("name", "email", "message")
MAX_FIELD_LENGTH = 2000
MAX_MESSAGE_LENGTH = 250


class ValidationError(Exception):
    """Raised when the incoming payload fails validation."""


def _cors_headers():
    """Build the CORS headers shared by every response."""
    return {
        "Access-Control-Allow-Origin": os.environ.get("CORS_ALLOW_ORIGIN", "*"),
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type",
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


def validate_payload(payload):
    """
    Validate and normalize the contact form payload.

    Args:
        payload (dict): Raw JSON payload with name, email, phone, message.

    Returns:
        dict: Normalized fields with keys name, email, phone, message.
              phone is an empty string when not provided.

    Raises:
        ValidationError: If a required field is missing, empty, too long,
            or the email address is malformed.
    """
    for field in REQUIRED_FIELDS:
        value = payload.get(field)
        if not isinstance(value, str) or not value.strip():
            raise ValidationError(f"Field '{field}' is required.")
        max_length = MAX_MESSAGE_LENGTH if field == "message" else MAX_FIELD_LENGTH
        if len(value) > max_length:
            raise ValidationError(f"Field '{field}' exceeds the maximum allowed length.")

    name = payload["name"].strip()
    email = payload["email"].strip()
    message = payload["message"].strip()

    if not is_valid_email(email):
        raise ValidationError("Field 'email' must be a valid email address.")

    phone = payload.get("phone")
    phone = phone.strip() if isinstance(phone, str) else ""
    if phone and not PHONE_REGEX.match(phone):
        raise ValidationError("Field 'phone' must be a country code followed by up to 10 digits.")

    return {"name": name, "email": email, "phone": phone, "message": message}


def render_email_template(fields):
    """
    Render the HTML email body by injecting form fields into the template file.

    All user-supplied values are HTML-escaped before injection to prevent
    markup injection into the outgoing email.

    Args:
        fields (dict): Normalized fields as returned by validate_payload.

    Returns:
        str: The rendered HTML document.
    """
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as template_file:
        template = template_file.read()

    phone_row = ""
    if fields["phone"]:
        phone_row = (
            '<tr>'
            '<td style="padding:10px 0;color:#94a3b8;font-size:13px;'
            'font-family:Inter,Segoe UI,sans-serif;width:120px;'
            'vertical-align:top;">Contact</td>'
            '<td style="padding:10px 0;color:#0f172a;font-size:14px;'
            'font-family:Inter,Segoe UI,sans-serif;">'
            f'{html.escape(fields["phone"])}</td>'
            '</tr>'
        )

    replacements = {
        "{{name}}": html.escape(fields["name"]),
        "{{email}}": html.escape(fields["email"]),
        "{{phone_row}}": phone_row,
        "{{message}}": html.escape(fields["message"]).replace("\n", "<br>"),
    }

    for placeholder, value in replacements.items():
        template = template.replace(placeholder, value)

    return template


def render_revert_template(fields):
    """
    Render the HTML auto-reply body sent back to the contact form submitter.

    Args:
        fields (dict): Normalized fields as returned by validate_payload.

    Returns:
        str: The rendered HTML document.
    """
    with open(REVERT_TEMPLATE_PATH, "r", encoding="utf-8") as template_file:
        template = template_file.read()

    return template.replace("{{name}}", html.escape(fields["name"]))


def build_email_message(from_email, to_email, subject, html_body):
    """
    Build a MIME email message ready to be sent over SMTP.

    Args:
        from_email (str): Sender address.
        to_email (str): Recipient address.
        subject (str): Email subject line.
        html_body (str): Rendered HTML body.

    Returns:
        EmailMessage: The composed message.
    """
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = from_email
    message["To"] = to_email
    message["Date"] = formatdate(localtime=True)
    message.set_content("This email requires an HTML-capable email client to view.")
    message.add_alternative(html_body, subtype="html")
    return message


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


def _get_smtp_password():
    """Fetch and cache the SMTP password from its SSM SecureString parameter."""
    global _ssm_client, _smtp_password_cache
    if _smtp_password_cache is None:
        if _ssm_client is None:
            _ssm_client = boto3.client("ssm")
        parameter_name = os.environ["SMTP_PASSWORD_SSM_PARAMETER"]
        response = _ssm_client.get_parameter(Name=parameter_name, WithDecryption=True)
        _smtp_password_cache = _clean_credential(response["Parameter"]["Value"])
    return _smtp_password_cache


def send_email(message):
    """
    Send one composed email message over SMTP.

    Two latency choices here matter for a rarely-invoked, cold-start-prone
    Lambda:
      - SMTP_SSL (implicit TLS, port 465) instead of SMTP+STARTTLS (587):
        the TLS handshake happens as part of the connection itself, so we
        skip the plaintext EHLO -> STARTTLS -> re-EHLO round trips STARTTLS
        requires.
      - server.close() instead of the context manager's server.quit(): we
        already have the server's "250 OK" for the DATA command by the time
        send_message() returns, so the message is delivered; skipping the
        QUIT round trip just for a polite goodbye isn't worth the latency.

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


_lambda_client = None


def _trigger_auto_reply(fields, function_arn):
    """
    Asynchronously invoke this same function to send the auto-reply.

    Sending it inline would mean a second full SMTP session (connect, TLS,
    AUTH, send) on the critical path the caller is waiting on — roughly
    doubling the response time. Dispatching it as an async ("Event")
    invocation returns as soon as Lambda has accepted the request, so the
    actual send happens in a separate, decoupled invocation afterwards.

    Never raises: this is a best-effort side effect and must not turn a
    successful submission into an error response.
    """
    global _lambda_client
    try:
        if _lambda_client is None:
            _lambda_client = boto3.client("lambda")
        _lambda_client.invoke(
            FunctionName=function_arn,
            InvocationType="Event",
            Payload=json.dumps({"_internal_task": "send_auto_reply", "fields": fields}).encode(
                "utf-8"
            ),
        )
    except Exception as exc:  # noqa: BLE001 - best-effort, must never block the response
        logger.error("Failed to trigger async auto-reply invocation: %s", exc)


def _handle_auto_reply_task(event):
    """
    Entry point for the async self-invocation triggered by _trigger_auto_reply.

    Runs after the HTTP response has already been returned to the caller,
    so its latency is invisible to them.
    """
    fields = event["fields"]
    try:
        revert_html = render_revert_template(fields)
        auto_reply_message = build_email_message(
            os.environ["FROM_EMAIL"], fields["email"], "Thanks for reaching out!", revert_html
        )
        send_email(auto_reply_message)
        logger.info("Auto-reply email sent successfully to %s", fields["email"])
    except (smtplib.SMTPException, OSError) as exc:
        logger.error("Failed to send auto-reply email to %s: %s", fields["email"], exc)
    return {"ok": True}


def lambda_handler(event, context):
    """
    Entry point for the contact-form Lambda.

    Parses and validates the incoming request, renders the email template,
    sends the email via SMTP, and returns a uniform API Gateway response.
    Also doubles as the entry point for its own async auto-reply
    invocation — see _handle_auto_reply_task.

    Args:
        event (dict): API Gateway Lambda proxy integration event, or an
            internal {"_internal_task": "send_auto_reply", ...} event.
        context (LambdaContext): Lambda runtime context.

    Returns:
        dict: API Gateway Lambda proxy integration response.
    """
    if event.get("_internal_task") == "send_auto_reply":
        return _handle_auto_reply_task(event)

    http_method = event.get("httpMethod") or event.get("requestContext", {}).get(
        "http", {}
    ).get("method")

    if http_method == "OPTIONS":
        logger.info("Responding to CORS preflight request.")
        return build_response(200, True, "OK")

    try:
        payload = parse_request_body(event)
        fields = validate_payload(payload)
        logger.info("Received contact form submission from %s", fields["email"])

        html_body = render_email_template(fields)
        to_email = os.environ["TO_EMAIL"]
        from_email = os.environ["FROM_EMAIL"]
        subject = f"New contact form submission from {fields['name']}"
        notification_message = build_email_message(from_email, to_email, subject, html_body)

        send_email(notification_message)
        logger.info("Contact form email sent successfully to %s", to_email)

        _trigger_auto_reply(fields, context.invoked_function_arn)

        return build_response(200, True, "Your message has been sent successfully.")

    except ValidationError as exc:
        logger.warning("Validation failed for contact form submission: %s", exc)
        return build_response(400, False, str(exc))

    except KeyError as exc:
        logger.error("Missing required environment variable: %s", exc)
        return build_response(500, False, "Server configuration error.")

    except (smtplib.SMTPException, OSError) as exc:
        logger.error("Failed to send contact form email: %s", exc)
        return build_response(502, False, "Failed to send your message. Please try again later.")

    except Exception as exc:  # noqa: BLE001 - final safety net for an API response
        logger.error("Unexpected error while processing contact form: %s", exc)
        return build_response(500, False, "An unexpected error occurred.")
