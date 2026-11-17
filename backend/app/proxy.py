"""Trusted proxy configuration.

TRUSTED_PROXY_HOPS is how many reverse proxies in front of the app we trust to
append to X-Forwarded-For. 0 (the default) trusts nothing: the connecting
address is used as-is. Anything above 0 makes Werkzeug's ProxyFix read the
client address that many entries from the right of the header, so a client
cannot choose its own address by sending a forged header.

Origin lock (optional). When ORIGIN_SECRET is set, a request that carries the
same value in an X-Origin-Secret header is "verified": it came through our own
front proxy, which adds one more entry to X-Forwarded-For. Verified requests
use VERIFIED_PROXY_HOPS (default: the same as TRUSTED_PROXY_HOPS); every other
request keeps using TRUSTED_PROXY_HOPS, so a direct caller cannot pick its own
address. The secret is compared in constant time and is never stored in the app
config or logged.
"""
import hmac
import os

from werkzeug.middleware.proxy_fix import ProxyFix

MAX_HOPS = 10
MIN_SECRET_LENGTH = 32
SECRET_HEADER_ENVIRON = "HTTP_X_ORIGIN_SECRET"
VERIFIED_KEY = "urstyleke.origin_verified"
HOPS_KEY = "urstyleke.proxy_hops"


def _read_hops(name, default):
    raw = os.environ.get(name, "").strip()
    if not raw:
        return default
    try:
        hops = int(raw)
    except ValueError:
        raise RuntimeError(f"{name} must be a whole number from 0 to 10")
    if not 0 <= hops <= MAX_HOPS:
        raise RuntimeError(f"{name} must be a whole number from 0 to 10")
    return hops


def trusted_proxy_hops():
    return _read_hops("TRUSTED_PROXY_HOPS", 0)


def origin_secret():
    secret = os.environ.get("ORIGIN_SECRET", "").strip()
    if secret and len(secret) < MIN_SECRET_LENGTH:
        raise RuntimeError(f"ORIGIN_SECRET must be at least {MIN_SECRET_LENGTH} characters")
    return secret


def verified_proxy_hops(direct_hops, secret):
    if os.environ.get("VERIFIED_PROXY_HOPS", "").strip() and not secret:
        raise RuntimeError("VERIFIED_PROXY_HOPS requires ORIGIN_SECRET")
    hops = _read_hops("VERIFIED_PROXY_HOPS", direct_hops)
    if hops < direct_hops:
        raise RuntimeError("VERIFIED_PROXY_HOPS must not be lower than TRUSTED_PROXY_HOPS")
    return hops


def _proxy_fix(wsgi_app, hops):
    if not hops:
        return wsgi_app
    return ProxyFix(wsgi_app, x_for=hops, x_proto=0, x_host=0, x_port=0, x_prefix=0)


class OriginAwareProxyFix:
    """Chooses the hop count per request, based on the origin secret header."""

    def __init__(self, wsgi_app, direct_hops, verified_hops, secret):
        self._secret = secret.encode("utf-8")
        self._direct_hops = direct_hops
        self._verified_hops = verified_hops
        self._direct = _proxy_fix(wsgi_app, direct_hops)
        self._verified = _proxy_fix(wsgi_app, verified_hops)

    def _is_verified(self, environ):
        supplied = environ.get(SECRET_HEADER_ENVIRON, "")
        if not supplied:
            return False
        return hmac.compare_digest(supplied.encode("utf-8", "replace"), self._secret)

    def __call__(self, environ, start_response):
        verified = self._is_verified(environ)
        environ[VERIFIED_KEY] = verified
        environ[HOPS_KEY] = self._verified_hops if verified else self._direct_hops
        target = self._verified if verified else self._direct
        return target(environ, start_response)


def apply_proxy_fix(app):
    direct = trusted_proxy_hops()
    secret = origin_secret()
    verified = verified_proxy_hops(direct, secret)
    app.config["TRUSTED_PROXY_HOPS"] = direct
    app.config["VERIFIED_PROXY_HOPS"] = verified
    app.config["ORIGIN_LOCK_ENABLED"] = bool(secret)
    if secret:
        app.wsgi_app = OriginAwareProxyFix(app.wsgi_app, direct, verified, secret)
    elif direct:
        app.wsgi_app = _proxy_fix(app.wsgi_app, direct)
