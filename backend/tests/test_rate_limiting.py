"""Rate limiting. Limits are off in the normal test run (see conftest) and are
switched on here with tiny limits."""
import pytest
from flask_jwt_extended import create_access_token

from app.ratelimit import limiter, reset_rate_limits

LOGIN = "/api/auth/login"
REGISTER = "/api/auth/register"
ORDERS = "/api/orders"
GOOD_PW = "Passw0rd!test"
GENEROUS_MINUTE = "1000 per minute"
GENEROUS_FAILS = "1000 per hour"


@pytest.fixture()
def limits_on(app, monkeypatch):
    monkeypatch.setattr(limiter, "enabled", True)
    monkeypatch.setitem(app.config, "RATELIMIT_ENABLED", True)
    monkeypatch.setitem(app.config, "RATELIMIT_LOGIN_IP", GENEROUS_MINUTE)
    monkeypatch.setitem(app.config, "RATELIMIT_REGISTER_IP", GENEROUS_MINUTE)
    monkeypatch.setitem(app.config, "RATELIMIT_ORDERS_USER", GENEROUS_MINUTE)
    monkeypatch.setitem(app.config, "RATELIMIT_LOGIN_FAILS", GENEROUS_FAILS)
    reset_rate_limits()
    yield app
    reset_rate_limits()


def post_login(client, email, password):
    return client.post(LOGIN, json={"email": email, "password": password})


def token_for(app, user_id):
    with app.app_context():
        return create_access_token(identity=str(user_id))


def test_login_ip_limit_returns_a_standard_429(client, limits_on, monkeypatch):
    monkeypatch.setitem(limits_on.config, "RATELIMIT_LOGIN_IP", "3 per minute")
    for _ in range(3):
        assert post_login(client, "nobody@example.com", GOOD_PW).status_code == 401
    r = post_login(client, "nobody@example.com", GOOD_PW)
    body = r.get_json()
    assert r.status_code == 429
    assert body["code"] == "rate_limited"
    assert isinstance(body["error"], str) and body["request_id"]
    assert 1 <= body["retry_after"] <= 3600
    assert 1 <= int(r.headers["Retry-After"]) <= 3600
    assert client.get("/api/products/").status_code == 200


def test_register_ip_limit(client, limits_on, monkeypatch):
    monkeypatch.setitem(limits_on.config, "RATELIMIT_REGISTER_IP", "2 per minute")
    bad = {"email": "x", "password": "y"}
    assert client.post(REGISTER, json=bad).status_code == 422
    assert client.post(REGISTER, json=bad).status_code == 422
    r = client.post(REGISTER, json=bad)
    assert r.status_code == 429
    assert r.get_json()["code"] == "rate_limited"


def test_failed_attempts_per_email_lock_out_even_the_right_password(client, limits_on, monkeypatch, make_user):
    monkeypatch.setitem(limits_on.config, "RATELIMIT_LOGIN_FAILS", "3 per 15 minutes")
    make_user("lock@example.com", password=GOOD_PW)
    for _ in range(3):
        assert post_login(client, "lock@example.com", "wrong-password-1").status_code == 401
    r = post_login(client, "lock@example.com", GOOD_PW)
    assert r.status_code == 429
    assert r.get_json()["code"] == "rate_limited"
    assert r.get_json()["retry_after"] >= 1


def test_unknown_emails_are_locked_the_same_way(client, limits_on, monkeypatch):
    monkeypatch.setitem(limits_on.config, "RATELIMIT_LOGIN_FAILS", "3 per 15 minutes")
    for _ in range(3):
        assert post_login(client, "ghost@example.com", GOOD_PW).status_code == 401
    assert post_login(client, "ghost@example.com", GOOD_PW).status_code == 429


def test_a_successful_login_resets_the_failure_count(client, limits_on, monkeypatch, make_user):
    monkeypatch.setitem(limits_on.config, "RATELIMIT_LOGIN_FAILS", "3 per 15 minutes")
    make_user("reset@example.com", password=GOOD_PW)
    for _ in range(2):
        assert post_login(client, "reset@example.com", "wrong-password-1").status_code == 401
    assert post_login(client, "reset@example.com", GOOD_PW).status_code == 200
    for _ in range(2):
        assert post_login(client, "reset@example.com", "wrong-password-1").status_code == 401
    assert post_login(client, "reset@example.com", GOOD_PW).status_code == 200


def test_one_locked_email_does_not_affect_another(client, limits_on, monkeypatch, make_user):
    monkeypatch.setitem(limits_on.config, "RATELIMIT_LOGIN_FAILS", "2 per 15 minutes")
    make_user("other@example.com", password=GOOD_PW)
    for _ in range(2):
        post_login(client, "locked@example.com", "wrong-password-1")
    assert post_login(client, "locked@example.com", GOOD_PW).status_code == 429
    assert post_login(client, "other@example.com", GOOD_PW).status_code == 200


def test_order_limit_is_counted_per_user(client, limits_on, monkeypatch, make_user):
    monkeypatch.setitem(limits_on.config, "RATELIMIT_ORDERS_USER", "2 per minute")
    a = make_user("a@example.com")
    b = make_user("b@example.com")
    ha = {"Authorization": f"Bearer {token_for(limits_on, a)}"}
    hb = {"Authorization": f"Bearer {token_for(limits_on, b)}"}
    empty = {"items": []}
    assert client.post(ORDERS, json=empty, headers=ha).status_code == 422
    assert client.post(ORDERS, json=empty, headers=ha).status_code == 422
    third = client.post(ORDERS, json=empty, headers=ha)
    assert third.status_code == 429
    assert third.get_json()["code"] == "rate_limited"
    assert client.post(ORDERS, json=empty, headers=hb).status_code == 422


def test_limits_are_off_by_default_in_the_test_run(client):
    for _ in range(25):
        assert post_login(client, "nobody@example.com", GOOD_PW).status_code == 401
