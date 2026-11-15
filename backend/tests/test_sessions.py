"""Refresh-token sessions: rotation, reuse detection, logout, cleanup, migration."""
from datetime import datetime, timedelta, timezone
from pathlib import Path

from flask_jwt_extended import create_refresh_token, decode_token
from sqlalchemy import inspect

from app.extensions import db
from app.models.refresh_token import RefreshToken

PW = "Passw0rd!test"
LOGIN = "/api/auth/login"
REFRESH = "/api/auth/refresh"
LOGOUT = "/api/auth/logout"
ME = "/api/auth/me"


def bearer(token):
    return {"Authorization": f"Bearer {token}"}


def login(client, email):
    r = client.post(LOGIN, json={"email": email, "password": PW})
    assert r.status_code == 200
    return r.get_json()


def jti_of(app, token):
    with app.app_context():
        return decode_token(token)["jti"]


def row(app, jti):
    with app.app_context():
        rec = RefreshToken.query.filter_by(jti=jti).first()
        if rec is None:
            return None
        return {
            "family": rec.family_id,
            "rotated": rec.rotated_at,
            "revoked": rec.revoked_at,
            "expires": rec.expires_at,
            "user_id": rec.user_id,
        }


def test_login_records_the_refresh_token(client, app, make_user):
    uid = make_user("s1@example.com", password=PW)
    tokens = login(client, "s1@example.com")
    rec = row(app, jti_of(app, tokens["refresh_token"]))
    assert rec["user_id"] == uid
    assert rec["rotated"] is None and rec["revoked"] is None
    assert app.config["JWT_REFRESH_TOKEN_EXPIRES"] == timedelta(days=7)
    remaining = rec["expires"] - datetime.now(timezone.utc)
    assert timedelta(days=6, hours=23) < remaining <= timedelta(days=7)


def test_refresh_rotates_the_token(client, app, make_user):
    make_user("s2@example.com", password=PW)
    first = login(client, "s2@example.com")["refresh_token"]
    r = client.post(REFRESH, headers=bearer(first))
    assert r.status_code == 200
    body = r.get_json()
    assert body["refresh_token"] != first and body["access_token"]
    old = row(app, jti_of(app, first))
    new = row(app, jti_of(app, body["refresh_token"]))
    assert old["rotated"] is not None and old["revoked"] is None
    assert new["rotated"] is None and new["family"] == old["family"]
    assert client.get(ME, headers=bearer(body["access_token"])).status_code == 200


def test_the_new_refresh_token_keeps_working(client, make_user):
    make_user("s3@example.com", password=PW)
    token = login(client, "s3@example.com")["refresh_token"]
    for _ in range(3):
        r = client.post(REFRESH, headers=bearer(token))
        assert r.status_code == 200
        token = r.get_json()["refresh_token"]


def test_reusing_a_retired_token_revokes_the_whole_session(client, app, monkeypatch, make_user):
    monkeypatch.setitem(app.config, "REFRESH_REUSE_GRACE_SECONDS", 0)
    make_user("s4@example.com", password=PW)
    first = login(client, "s4@example.com")["refresh_token"]
    second = client.post(REFRESH, headers=bearer(first)).get_json()["refresh_token"]

    reuse = client.post(REFRESH, headers=bearer(first))
    assert reuse.status_code == 401
    assert reuse.get_json()["code"] == "token_revoked"

    child = client.post(REFRESH, headers=bearer(second))
    assert child.status_code == 401
    assert child.get_json()["code"] == "token_revoked"
    assert row(app, jti_of(app, second))["revoked"] is not None


def test_a_quick_double_refresh_is_tolerated(client, app, make_user):
    make_user("s5@example.com", password=PW)
    first = login(client, "s5@example.com")["refresh_token"]
    a = client.post(REFRESH, headers=bearer(first))
    b = client.post(REFRESH, headers=bearer(first))
    assert a.status_code == 200 and b.status_code == 200
    assert a.get_json()["refresh_token"] != b.get_json()["refresh_token"]
    assert client.post(REFRESH, headers=bearer(b.get_json()["refresh_token"])).status_code == 200
    assert row(app, jti_of(app, first))["revoked"] is None


def test_logout_revokes_the_session(client, make_user):
    make_user("s6@example.com", password=PW)
    tokens = login(client, "s6@example.com")
    out = client.post(LOGOUT, headers=bearer(tokens["refresh_token"]))
    assert out.status_code == 200
    again = client.post(REFRESH, headers=bearer(tokens["refresh_token"]))
    assert again.status_code == 401
    assert again.get_json()["code"] == "token_revoked"
    assert client.post(LOGOUT, headers=bearer(tokens["refresh_token"])).status_code == 200


def test_a_refresh_token_without_a_stored_session_is_rejected(client, app, make_user):
    uid = make_user("s7@example.com", password=PW)
    with app.app_context():
        legacy = create_refresh_token(identity=str(uid))
    r = client.post(REFRESH, headers=bearer(legacy))
    assert r.status_code == 401
    assert r.get_json()["code"] == "token_revoked"


def test_token_types_cannot_be_swapped(client, make_user):
    make_user("s8@example.com", password=PW)
    tokens = login(client, "s8@example.com")
    assert client.post(REFRESH, headers=bearer(tokens["access_token"])).status_code == 422
    assert client.get(ME, headers=bearer(tokens["refresh_token"])).status_code == 422


def test_login_removes_expired_session_rows(client, app, make_user):
    uid = make_user("s9@example.com", password=PW)
    with app.app_context():
        db.session.add(
            RefreshToken(
                jti="expired-jti",
                family_id="old-family",
                user_id=uid,
                expires_at=datetime.now(timezone.utc) - timedelta(days=1),
            )
        )
        db.session.commit()
    login(client, "s9@example.com")
    assert row(app, "expired-jti") is None


def test_migration_downgrades_and_upgrades_cleanly(app):
    from flask_migrate import downgrade, upgrade

    migrations = str(Path(__file__).resolve().parent.parent / "migrations")
    with app.app_context():
        downgrade(directory=migrations, revision="-1")
        assert "refresh_tokens" not in inspect(db.engine).get_table_names()
        upgrade(directory=migrations)
        assert "refresh_tokens" in inspect(db.engine).get_table_names()
