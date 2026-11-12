"""Every error has one format; unexpected errors never leak details; logs
never contain credentials."""
import logging
import re
from datetime import timedelta

import pytest
from flask_jwt_extended import create_access_token


@pytest.fixture(autouse=True)
def clean_db():
    """These tests never touch table data, so skip the per-test truncate."""
    yield


HEX32 = re.compile(r"^[0-9a-f]{32}$")


def assert_consistent_error(response, status, code):
    body = response.get_json()
    assert response.status_code == status
    assert isinstance(body["error"], str) and body["error"]
    assert body["code"] == code
    assert body["request_id"] == response.headers["X-Request-ID"]


def test_unknown_url_returns_json_404(client):
    assert_consistent_error(client.get("/api/does-not-exist"), 404, "not_found")


def test_wrong_method_returns_json_405_with_allow_header(client):
    r = client.delete("/")
    assert_consistent_error(r, 405, "method_not_allowed")
    assert "GET" in r.headers["Allow"]


def test_valid_request_id_is_echoed(client):
    r = client.get("/", headers={"X-Request-ID": "req-12345678"})
    assert r.headers["X-Request-ID"] == "req-12345678"


@pytest.mark.parametrize("bad", ["short", "has spaces and !!! chars", "x" * 100])
def test_invalid_request_id_is_replaced(client, bad):
    r = client.get("/", headers={"X-Request-ID": bad})
    assert r.headers["X-Request-ID"] != bad
    assert HEX32.match(r.headers["X-Request-ID"])


def test_missing_token_is_consistent_401(client):
    assert_consistent_error(client.get("/api/orders"), 401, "authorization_required")


def test_invalid_token_is_consistent_422(client):
    r = client.get("/api/orders", headers={"Authorization": "Bearer garbage"})
    assert_consistent_error(r, 422, "invalid_token")


def test_expired_token_is_consistent_401(client, app):
    with app.app_context():
        token = create_access_token(identity="1", expires_delta=timedelta(seconds=-10))
    r = client.get("/api/orders", headers={"Authorization": f"Bearer {token}"})
    assert_consistent_error(r, 401, "token_expired")


def test_anonymous_product_write_is_consistent_401(client):
    r = client.post("/api/products/", json={"title": "x", "price": 1})
    assert_consistent_error(r, 401, "authorization_required")


def test_unexpected_exception_is_generic_500_and_is_logged(caplog):
    from app import create_app

    fresh = create_app()

    @fresh.route("/__boom")
    def boom():
        raise RuntimeError("secret-boom-detail")

    with caplog.at_level(logging.INFO, logger="app"):
        r = fresh.test_client().get("/__boom")

    assert_consistent_error(r, 500, "internal_error")
    assert r.get_json()["error"] == "Internal server error"
    assert "secret-boom-detail" not in r.get_data(as_text=True)
    assert any(
        "secret-boom-detail" in str(rec.exc_info[1]) for rec in caplog.records if rec.exc_info
    )


def test_logs_never_contain_the_authorization_header(client, caplog):
    with caplog.at_level(logging.INFO, logger="app"):
        client.get("/api/orders", headers={"Authorization": "Bearer not-a-real-token-secret"})
    request_logs = [r for r in caplog.records if r.name == "app.request"]
    assert any(r.status == 422 and r.path == "/api/orders" for r in request_logs)
    assert all("not-a-real-token-secret" not in str(vars(r)) for r in caplog.records)
