"""Auth behaviour that needs real users: normalisation, uniform login, profile."""
import pytest
from flask_jwt_extended import create_access_token

from app.models.user import User

GOOD_PW = "Passw0rd!test"
REGISTER = "/api/auth/register"
LOGIN = "/api/auth/login"
PROFILE = "/api/auth/profile"


def token_for(app, user_id):
    with app.app_context():
        return create_access_token(identity=str(user_id))


def test_register_normalizes_email_and_blocks_case_variants(client, app):
    r = client.post(REGISTER, json={"email": "  Bob@Example.COM ", "password": GOOD_PW})
    assert r.status_code == 201
    with app.app_context():
        assert [u.email for u in User.query.all()] == ["bob@example.com"]

    dup = client.post(REGISTER, json={"email": "BOB@example.com", "password": GOOD_PW})
    assert dup.status_code == 409
    assert dup.get_json()["code"] == "email_taken"

    login = client.post(LOGIN, json={"email": "BOB@EXAMPLE.com", "password": GOOD_PW})
    assert login.status_code == 200
    assert login.get_json()["email"] == "bob@example.com"


def test_login_failures_look_identical(client, make_user):
    make_user("real@example.com", password=GOOD_PW)
    unknown = client.post(LOGIN, json={"email": "nobody@example.com", "password": GOOD_PW})
    wrong = client.post(LOGIN, json={"email": "real@example.com", "password": "wrong-password-1"})
    assert unknown.status_code == wrong.status_code == 401
    a, b = unknown.get_json(), wrong.get_json()
    assert a["error"] == b["error"]
    assert a["code"] == b["code"] == "invalid_credentials"


def test_unknown_email_still_runs_a_password_hash_check(client, monkeypatch):
    import app.routes.auth as auth_routes

    calls = []
    real = auth_routes.check_password_hash

    def spy(password_hash, password):
        calls.append(password_hash)
        return real(password_hash, password)

    monkeypatch.setattr(auth_routes, "check_password_hash", spy)
    r = client.post(LOGIN, json={"email": "nobody@example.com", "password": GOOD_PW})
    assert r.status_code == 401
    assert calls == [auth_routes._DUMMY_HASH]


def test_existing_account_with_a_weak_old_password_can_still_log_in(client, make_user):
    make_user("legacy@example.com", password="123")
    r = client.post(LOGIN, json={"email": "legacy@example.com", "password": "123"})
    assert r.status_code == 200


def test_profile_rejects_a_weak_password_and_changes_nothing(client, app, make_user):
    uid = make_user("p@example.com", password=GOOD_PW)
    r = client.put(
        PROFILE, json={"password": "short"}, headers={"Authorization": f"Bearer {token_for(app, uid)}"}
    )
    assert r.status_code == 422
    assert r.get_json()["code"] == "validation_error"
    assert client.post(LOGIN, json={"email": "p@example.com", "password": GOOD_PW}).status_code == 200


def test_profile_accepts_a_strong_password(client, app, make_user):
    uid = make_user("q@example.com", password=GOOD_PW)
    new_pw = "A-brand-new-passphrase"
    r = client.put(
        PROFILE, json={"password": new_pw}, headers={"Authorization": f"Bearer {token_for(app, uid)}"}
    )
    assert r.status_code == 200
    assert client.post(LOGIN, json={"email": "q@example.com", "password": new_pw}).status_code == 200
    assert client.post(LOGIN, json={"email": "q@example.com", "password": GOOD_PW}).status_code == 401
