"""One error format for the whole API:
{"error": "<message>", "code": "<machine_code>", "request_id": "<id>"}
`error` stays a string so existing frontend code that reads data.error works.
"""
import logging

from flask import g, jsonify
from werkzeug.exceptions import HTTPException

from app.extensions import db

log = logging.getLogger("app.errors")

_MESSAGES = {
    400: "Bad request",
    401: "Authentication required",
    403: "Forbidden",
    404: "Resource not found",
    405: "Method not allowed",
    409: "Conflict",
    413: "Request too large",
    415: "Unsupported media type",
    422: "Unprocessable request",
    429: "Too many requests",
}
_CODES = {
    400: "bad_request",
    401: "unauthorized",
    403: "forbidden",
    404: "not_found",
    405: "method_not_allowed",
    409: "conflict",
    413: "payload_too_large",
    415: "unsupported_media_type",
    422: "unprocessable_entity",
    429: "too_many_requests",
}


class ApiError(Exception):
    """Raise anywhere in a request to answer with the standard error format."""

    def __init__(self, message, status=400, code=None, fields=None):
        super().__init__(message)
        self.message = message
        self.status = status
        self.code = code
        self.fields = fields


def error_response(message, status, code=None, extra=None):
    body = {"error": message, "code": code or _CODES.get(status, "error")}
    if extra:
        body.update(extra)
    request_id = getattr(g, "request_id", None)
    if request_id:
        body["request_id"] = request_id
    return jsonify(body), status


def register_error_handlers(app):
    @app.errorhandler(HTTPException)
    def handle_http_exception(exc):
        status = exc.code or 500
        response, _ = error_response(_MESSAGES.get(status, exc.name), status)
        for key, value in exc.get_headers():  # keeps e.g. the Allow header on 405
            if key.lower() not in ("content-type", "content-length"):
                response.headers[key] = value
        if status >= 500:
            log.error("http error %s", status, exc_info=exc)
        return response, status

    @app.errorhandler(ApiError)
    def handle_api_error(exc):
        extra = {"fields": exc.fields} if exc.fields else None
        return error_response(exc.message, exc.status, exc.code, extra=extra)

    @app.errorhandler(Exception)
    def handle_unexpected_exception(exc):
        db.session.rollback()
        log.error("unhandled exception", exc_info=exc)
        return error_response("Internal server error", 500, "internal_error")


def register_jwt_error_handlers(jwt):
    @jwt.unauthorized_loader
    def _missing_token(reason):
        log.info("jwt missing", extra={"reason": str(reason)[:100]})
        return error_response("Authentication required", 401, "authorization_required")

    @jwt.invalid_token_loader
    def _invalid_token(reason):
        log.warning("jwt invalid", extra={"reason": str(reason)[:100]})
        return error_response("Invalid token", 422, "invalid_token")

    @jwt.expired_token_loader
    def _expired_token(jwt_header, jwt_payload):
        return error_response("Token has expired", 401, "token_expired")
