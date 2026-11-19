"""CORS is opt-in: off unless CORS_ORIGINS lists exact origins."""
import pytest
from flask import Flask

from app.cors import init_cors

ALLOWED = "https://shop.example"


@pytest.fixture
def make_app(monkeypatch):
    def build(value=None):
        monkeypatch.delenv("CORS_ORIGINS", raising=False)
        if value is not None:
            monkeypatch.setenv("CORS_ORIGINS", value)
        app = Flask("cors-test")
        init_cors(app)

        @app.get("/api/ping")
        def ping():
            return {"ok": True}

        @app.get("/other")
        def other():
            return {"ok": True}

        return app

    return build


def allow_origin(app, path, origin):
    response = app.test_client().get(path, headers={"Origin": origin})
    assert response.status_code == 200
    return response.headers.get("Access-Control-Allow-Origin")


def test_off_by_default_sends_no_cors_headers(make_app):
    app = make_app()
    assert allow_origin(app, "/api/ping", ALLOWED) is None
    preflight = app.test_client().options(
        "/api/ping", headers={"Origin": ALLOWED, "Access-Control-Request-Method": "POST"}
    )
    assert preflight.headers.get("Access-Control-Allow-Origin") is None


def test_listed_origin_is_allowed(make_app):
    assert allow_origin(make_app(ALLOWED), "/api/ping", ALLOWED) == ALLOWED


def test_unlisted_origin_gets_nothing(make_app):
    assert allow_origin(make_app(ALLOWED), "/api/ping", "https://evil.example") is None


def test_only_api_paths_are_covered(make_app):
    assert allow_origin(make_app(ALLOWED), "/other", ALLOWED) is None


def test_preflight_for_listed_origin(make_app):
    response = make_app(ALLOWED).test_client().options(
        "/api/ping",
        headers={
            "Origin": ALLOWED,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("Access-Control-Allow-Origin") == ALLOWED
    assert "post" in response.headers.get("Access-Control-Allow-Methods", "").lower()
    assert "authorization" in response.headers.get("Access-Control-Allow-Headers", "").lower()


def test_entries_are_trimmed_and_normalised(make_app):
    app = make_app(" https://shop.example/ , http://localhost:3000 ,,")
    assert app.config["CORS_ORIGINS"] == ["https://shop.example", "http://localhost:3000"]
    assert allow_origin(app, "/api/ping", "http://localhost:3000") == "http://localhost:3000"


def test_blank_value_means_off(make_app):
    app = make_app(" , ,")
    assert app.config["CORS_ORIGINS"] == []
    assert allow_origin(app, "/api/ping", ALLOWED) is None


def test_wildcard_is_rejected(make_app):
    with pytest.raises(RuntimeError, match="wildcards"):
        make_app("*")


def test_plain_http_is_rejected_except_for_localhost(make_app):
    with pytest.raises(RuntimeError, match="must use https"):
        make_app("http://shop.example")
    assert make_app("http://127.0.0.1:3000").config["CORS_ORIGINS"] == ["http://127.0.0.1:3000"]


def test_paths_and_credentials_are_rejected(make_app):
    with pytest.raises(RuntimeError, match="scheme, host"):
        make_app("https://shop.example/app")
    with pytest.raises(RuntimeError, match="scheme, host"):
        make_app("https://user@shop.example")
