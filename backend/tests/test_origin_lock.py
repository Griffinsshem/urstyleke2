"""Origin lock: a secret header decides how far to trust X-Forwarded-For."""
import logging

import pytest
from flask import Flask, request

from app.observability import init_request_logging
from app.proxy import apply_proxy_fix

SECRET = "unit-test-origin-secret-0123456789abcdef"
ENV_NAMES = ("TRUSTED_PROXY_HOPS", "VERIFIED_PROXY_HOPS", "ORIGIN_SECRET")

# Chains as the app sees them. 1.1.1.1 is the real visitor.
# DIRECT: caller forged 6.6.6.6, then 3 proxies appended entries.
DIRECT_CHAIN = "6.6.6.6, 1.1.1.1, 10.0.0.1, 10.0.0.2"
# VERCEL: visitor + one extra hop from our own front proxy + 3 proxies.
VERCEL_CHAIN = "1.1.1.1, 10.0.0.9, 10.0.0.1, 10.0.0.2"


@pytest.fixture
def make_app(monkeypatch):
    def build(**env):
        for name in ENV_NAMES:
            monkeypatch.delenv(name, raising=False)
        for name, value in env.items():
            monkeypatch.setenv(name, value)
        app = Flask("origin-lock-test")
        apply_proxy_fix(app)
        init_request_logging(app)

        @app.get("/who")
        def who():
            return {
                "addr": request.remote_addr,
                "verified": bool(request.environ.get("urstyleke.origin_verified", False)),
            }

        return app

    return build


def ask(app, chain, secret=None):
    headers = {"X-Forwarded-For": chain}
    if secret is not None:
        headers["X-Origin-Secret"] = secret
    response = app.test_client().get(
        "/who", headers=headers, environ_overrides={"REMOTE_ADDR": "10.0.0.2"}
    )
    assert response.status_code == 200
    return response.get_json()


def locked(make_app, direct="3", verified="4"):
    return make_app(TRUSTED_PROXY_HOPS=direct, VERIFIED_PROXY_HOPS=verified, ORIGIN_SECRET=SECRET)


def test_direct_request_uses_direct_hops(make_app):
    result = ask(locked(make_app), DIRECT_CHAIN)
    assert result == {"addr": "1.1.1.1", "verified": False}


def test_verified_request_uses_verified_hops(make_app):
    result = ask(locked(make_app), VERCEL_CHAIN, SECRET)
    assert result == {"addr": "1.1.1.1", "verified": True}


def test_wrong_secret_cannot_select_verified_hops(make_app):
    app = locked(make_app)
    # Wrong secret: direct hops apply, the forged entry is ignored.
    assert ask(app, DIRECT_CHAIN, "wrong-" + SECRET) == {"addr": "1.1.1.1", "verified": False}
    # The right secret would trust the extra hop and read the forged entry,
    # which is why the secret must never leave Vercel and Render.
    assert ask(app, DIRECT_CHAIN, SECRET)["addr"] == "6.6.6.6"


def test_missing_header_is_treated_as_direct(make_app):
    result = ask(locked(make_app), VERCEL_CHAIN)
    assert result["verified"] is False
    assert result["addr"] == "10.0.0.9"


def test_non_ascii_header_does_not_crash(make_app):
    result = ask(locked(make_app), DIRECT_CHAIN, "s\u00e9cret")
    assert result == {"addr": "1.1.1.1", "verified": False}


def test_lock_disabled_ignores_header(make_app):
    app = make_app(TRUSTED_PROXY_HOPS="3")
    assert app.config["ORIGIN_LOCK_ENABLED"] is False
    assert ask(app, DIRECT_CHAIN, SECRET) == {"addr": "1.1.1.1", "verified": False}


def test_verified_hops_default_to_direct_hops(make_app):
    app = make_app(TRUSTED_PROXY_HOPS="4", ORIGIN_SECRET=SECRET)
    assert app.config["VERIFIED_PROXY_HOPS"] == 4
    assert ask(app, VERCEL_CHAIN, SECRET) == {"addr": "1.1.1.1", "verified": True}


def test_short_secret_is_rejected(make_app):
    with pytest.raises(RuntimeError, match="at least 32"):
        make_app(TRUSTED_PROXY_HOPS="3", ORIGIN_SECRET="too-short")


def test_verified_hops_without_secret_is_rejected(make_app):
    with pytest.raises(RuntimeError, match="requires ORIGIN_SECRET"):
        make_app(TRUSTED_PROXY_HOPS="3", VERIFIED_PROXY_HOPS="4")


def test_verified_hops_below_direct_is_rejected(make_app):
    with pytest.raises(RuntimeError, match="must not be lower"):
        make_app(TRUSTED_PROXY_HOPS="4", VERIFIED_PROXY_HOPS="3", ORIGIN_SECRET=SECRET)


def _request_record(caplog):
    records = [r for r in caplog.records if r.name == "app.request" and r.getMessage() == "request"]
    assert len(records) == 1
    return records[0]


def test_request_log_marks_verified(make_app, caplog):
    app = locked(make_app)
    caplog.set_level(logging.INFO, logger="app.request")
    ask(app, VERCEL_CHAIN, SECRET)
    record = _request_record(caplog)
    assert record.origin_verified is True
    assert record.trusted_hops == 4
    assert record.xff_hops == 4


def test_request_log_marks_direct(make_app, caplog):
    app = locked(make_app)
    caplog.set_level(logging.INFO, logger="app.request")
    ask(app, DIRECT_CHAIN)
    record = _request_record(caplog)
    assert record.origin_verified is False
    assert record.trusted_hops == 3


def test_config_never_holds_the_secret(make_app):
    app = locked(make_app)
    assert SECRET not in str(dict(app.config))
