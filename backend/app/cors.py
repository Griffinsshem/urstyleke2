"""CORS is opt-in.

The website calls /api on its own origin (the Next.js proxy forwards it to this
API server-to-server), so no browser needs cross-origin access and CORS is off
by default. Set CORS_ORIGINS to a comma-separated list of exact origins, for
example "https://shop.example,http://localhost:3000", only if a browser app on
another origin must call the API directly. Wildcards are refused. Credentials
(cookies) are never allowed cross-origin: sessions use SameSite=Lax cookies.
"""
import os
from urllib.parse import urlsplit

from flask_cors import CORS

LOCAL_HOSTS = {"localhost", "127.0.0.1"}


def _normalise(origin):
    if "*" in origin:
        raise RuntimeError("CORS_ORIGINS must list exact origins; wildcards are not allowed")
    try:
        parts = urlsplit(origin)
        parts.port  # raises ValueError for a bad port
    except ValueError:
        raise RuntimeError(
            "CORS_ORIGINS entries must be a scheme, host and optional port, like https://example.com"
        )
    if (
        parts.scheme not in ("http", "https")
        or not parts.hostname
        or parts.username is not None
        or parts.path not in ("", "/")
        or parts.query
        or parts.fragment
    ):
        raise RuntimeError(
            "CORS_ORIGINS entries must be a scheme, host and optional port, like https://example.com"
        )
    if parts.scheme == "http" and parts.hostname.lower() not in LOCAL_HOSTS:
        raise RuntimeError("CORS_ORIGINS must use https (http is allowed only for localhost)")
    return f"{parts.scheme}://{parts.netloc.lower()}"


def cors_origins():
    raw = os.environ.get("CORS_ORIGINS", "")
    return [_normalise(item.strip()) for item in raw.split(",") if item.strip()]


def init_cors(app):
    origins = cors_origins()
    app.config["CORS_ORIGINS"] = origins
    if not origins:
        return
    CORS(
        app,
        resources={r"/api/*": {"origins": origins}},
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Retry-After", "X-Request-ID"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )
