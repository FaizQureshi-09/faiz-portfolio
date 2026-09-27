"""
AWS Lambda handler for the portfolio's "/experience" GET endpoint.

Computes total professional experience as completed years and completed
months in the current year (e.g. 2 years 11 months -> "2.11") from a fixed
START_DATE environment variable through today's date in IST. The frontend
fetches this once and uses it wherever experience is displayed, so the
resume-facing number always stays accurate without a redeploy.

Required environment variables:
    START_DATE  - Career start date in dd/mm/yyyy format.

Optional environment variables:
    CORS_ALLOW_ORIGIN  - Value for Access-Control-Allow-Origin. Defaults to "*".
"""

import json
import logging
import os
from datetime import datetime, timedelta, timezone

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# India does not observe DST, so IST is always a fixed UTC+5:30 offset —
# no tzdata database needed (Lambda's minimal runtime image may not have one).
IST = timezone(timedelta(hours=5, minutes=30))
DATE_FORMAT = "%d/%m/%Y"


def _cors_headers():
    """Build the CORS headers shared by every response."""
    return {
        "Access-Control-Allow-Origin": os.environ.get("CORS_ALLOW_ORIGIN", "*"),
        "Access-Control-Allow-Methods": "OPTIONS,GET",
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


def get_current_date_ist():
    """Return today's date in IST as a dd/mm/yyyy string."""
    return datetime.now(IST).strftime(DATE_FORMAT)


def calculate_total_experience(start_date_str, today_str=None):
    """
    Calculate total experience from start_date_str to today (IST).

    Counts only fully completed years and, within the current year, fully
    completed months — leftover days are dropped. E.g. start 01/06/2023 to
    05/05/2026 is 2 years 11 months ("2.11"); to 18/07/2026 is 3 years 1
    month ("3.1").

    Args:
        start_date_str (str): Career start date, dd/mm/yyyy.
        today_str (str | None): Override for "today" (dd/mm/yyyy) — used in
            tests. Defaults to the current IST date.

    Returns:
        dict: {"years": int, "months": int, "totalExperience": "<years>.<months>"}
    """
    start = datetime.strptime(start_date_str, DATE_FORMAT).date()
    today = datetime.strptime(today_str or get_current_date_ist(), DATE_FORMAT).date()

    years = today.year - start.year
    months = today.month - start.month
    if today.day < start.day:
        months -= 1
    if months < 0:
        years -= 1
        months += 12

    return {"years": years, "months": months, "totalExperience": f"{years}.{months}"}


def lambda_handler(event, context):
    """
    Entry point for the /experience GET endpoint.

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
        start_date = os.environ["START_DATE"]
        experience = calculate_total_experience(start_date)
        experience["asOfDate"] = get_current_date_ist()

        return build_response(200, True, "OK", data=experience)

    except KeyError as exc:
        logger.error("Missing required environment variable: %s", exc)
        return build_response(500, False, "Server configuration error.")

    except ValueError as exc:
        logger.error("Invalid START_DATE value '%s': %s", os.environ.get("START_DATE"), exc)
        return build_response(500, False, "Server configuration error.")

    except Exception as exc:  # noqa: BLE001 - final safety net for an API response
        logger.error("Unexpected error while calculating experience: %s", exc)
        return build_response(500, False, "An unexpected error occurred.")
