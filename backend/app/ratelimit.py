"""Rate limiting (Flask-Limiter with in-memory counters).

Counters live in this process only. That is correct for the current single
Gunicorn worker and resets when the service restarts or sleeps. The client IP
is request.remote_addr, which TRUSTED_PROXY_HOPS (see proxy.py) makes the real
visitor address behind Render's proxies.

Limits (override with the environment variables of the same name):
  RATELIMIT_LOGIN_IP     per IP on login
  RATELIMIT_REGISTER_IP  per IP on register
  RATELIMIT_ORDERS_USER  per signed-in user on order creation
  RATELIMIT_LOGIN_FAILS  failed logins per email (counts unknown emails too,
                         so a 429 never reveals whether an account exists)
RATELIMIT_ENABLED=false turns everything off (used by the test suite).
"""
import os
import time

from flask import current_app, request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from flask_limiter import Limiter, RateLimitExceeded
from flask_limiter.util import get_remote_address
from limits import parse
from limits.storage import MemoryStorage
from limits.strategies import FixedWindowRateLimiter

from app.errors import error_response

DEFAULTS = {
    "RATELIMIT_LOGIN_IP": "20 per minute;100 per hour",
    "RATELIMIT_REGISTER_IP": "10 per hour",
    "RATELIMIT_ORDERS_USER": "30 per minute",
    "RATELIMIT_LOGIN_FAILS": "8 per 15 minutes",
}

# headers_enabled=False: the library would add Retry-After to every response from a
# limited route (even a 401). We send Retry-After ourselves, only on 429s.
limiter = Limiter(key_func=get_remote_address, storage_uri="memory://", headers_enabled=False)

_storage = MemoryStorage()
_strategy = FixedWindowRateLimiter(_storage)
_FAIL_NS = "login-fail"


def _config(key):
    return current_app.config.get(key, DEFAULTS[key])


def _enabled():
    return bool(current_app.config.get("RATELIMIT_ENABLED", True))


# Limit-string providers: evaluated on every request so tests can shrink them.
def login_ip_limit():
    return _config("RATELIMIT_LOGIN_IP")


def register_ip_limit():
    return _config("RATELIMIT_REGISTER_IP")


def orders_user_limit():
    return _config("RATELIMIT_ORDERS_USER")


def user_or_ip_key():
    """Signed-in user if the token is valid, otherwise the client address."""
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
    except Exception:
        identity = None
    if identity:
        return f"user:{identity}"
    return f"ip:{request.remote_addr or 'unknown'}"


# ---- per-email failed-login counter ----
def _fail_item():
    return parse(_config("RATELIMIT_LOGIN_FAILS"))


def login_is_blocked(email):
    if not _enabled():
        return False
    return not _strategy.test(_fail_item(), _FAIL_NS, email)


def record_login_failure(email):
    if _enabled():
        _strategy.hit(_fail_item(), _FAIL_NS, email)


def clear_login_failures(email):
    if _enabled():
        _strategy.clear(_fail_item(), _FAIL_NS, email)


def login_retry_after(email):
    try:
        reset_time = _strategy.get_window_stats(_fail_item(), _FAIL_NS, email).reset_time
        return max(1, int(reset_time - time.time()) + 1)
    except Exception:
        return 60


# ---- responses ----
def rate_limited_response(retry_after):
    retry_after = max(1, int(retry_after))
    response, status = error_response(
        "Too many attempts. Please try again later.",
        429,
        "rate_limited",
        extra={"retry_after": retry_after},
    )
    response.headers["Retry-After"] = str(retry_after)
    return response, status


def _handle_rate_limit_exceeded(exc):
    retry_after = 60
    try:
        current = limiter.current_limit
        if current is not None and current.reset_at:
            retry_after = int(current.reset_at - time.time()) + 1
        else:
            retry_after = int(exc.limit.limit.get_expiry())
    except Exception:
        pass
    return rate_limited_response(retry_after)


def reset_rate_limits():
    """Forget every counter (used by tests)."""
    try:
        limiter.reset()
    except Exception:
        pass
    _storage.reset()


def init_rate_limiting(app):
    flag = os.environ.get("RATELIMIT_ENABLED", "true").strip().lower()
    desired = flag not in ("0", "false", "no", "off")

    for key, default in DEFAULTS.items():
        app.config[key] = os.environ.get(key, default)

    # Always initialise enabled so the hooks are registered, then apply the real
    # switch; tests can flip limiter.enabled on and off at runtime.
    app.config["RATELIMIT_ENABLED"] = True
    app.config.setdefault("RATELIMIT_STORAGE_URI", "memory://")
    limiter.init_app(app)
    limiter.enabled = desired
    app.config["RATELIMIT_ENABLED"] = desired

    app.register_error_handler(RateLimitExceeded, _handle_rate_limit_exceeded)
