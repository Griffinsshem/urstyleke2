"""Request IDs and structured (JSON) logging.

Logging rules: never log query strings, headers, request bodies, tokens or
passwords. Only method, path, status code, duration and the request id.
"""
import json
import logging
import os
import re
import sys
import time
import uuid
from datetime import datetime, timezone

from flask import g, has_request_context, request

_REQUEST_ID_RE = re.compile(r"^[A-Za-z0-9._-]{8,64}$")
_RESERVED = set(vars(logging.LogRecord("", 0, "", 0, "", (), None))) | {"message", "asctime"}


class JsonFormatter(logging.Formatter):
    def format(self, record):
        payload = {
            "ts": datetime.fromtimestamp(record.created, timezone.utc).isoformat(timespec="milliseconds"),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        for key, value in vars(record).items():
            if key not in _RESERVED and not key.startswith("_"):
                payload[key] = value
        if has_request_context() and "request_id" not in payload:
            payload["request_id"] = getattr(g, "request_id", None)
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload, default=str)


def configure_logging(app):
    logger = logging.getLogger("app")
    level = os.environ.get("LOG_LEVEL", "INFO").upper()
    logger.setLevel(getattr(logging, level, logging.INFO))
    if not any(getattr(h, "_urstyleke", False) for h in logger.handlers):
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JsonFormatter())
        handler._urstyleke = True
        logger.addHandler(handler)


def _xff_hops():
    """How many entries X-Forwarded-For has. A count only; addresses are never logged."""
    header = request.headers.get("X-Forwarded-For", "")
    return len([part for part in header.split(",") if part.strip()])


def init_request_logging(app):
    log = logging.getLogger("app.request")

    @app.before_request
    def _start_request():
        incoming = request.headers.get("X-Request-ID", "")
        g.request_id = incoming if _REQUEST_ID_RE.match(incoming) else uuid.uuid4().hex
        g.request_started = time.perf_counter()

    @app.after_request
    def _finish_request(response):
        request_id = getattr(g, "request_id", None)
        if request_id:
            response.headers["X-Request-ID"] = request_id
        started = getattr(g, "request_started", None)
        duration = round((time.perf_counter() - started) * 1000, 1) if started else None
        level = logging.WARNING if response.status_code >= 500 else logging.INFO
        log.log(
            level,
            "request",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.path,
                "status": response.status_code,
                "duration_ms": duration,
                "xff_hops": _xff_hops(),
                "trusted_hops": app.config.get("TRUSTED_PROXY_HOPS", 0),
            },
        )
        return response
