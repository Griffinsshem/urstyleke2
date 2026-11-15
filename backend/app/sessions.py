"""Refresh-token sessions: rotation, reuse detection and revocation.

Every login starts a "family". Each refresh retires the presented token and issues
a new one in the same family. Presenting a retired token again is treated as theft
and revokes the whole family, except inside a short grace window so two browser
tabs refreshing at the same moment do not log the user out.
"""
import logging
import uuid
from datetime import datetime, timezone

from flask import current_app
from flask_jwt_extended import create_refresh_token, decode_token

from app.errors import ApiError
from app.extensions import db
from app.models.refresh_token import RefreshToken

log = logging.getLogger("app.sessions")

DEFAULT_GRACE_SECONDS = 10


def _now():
    return datetime.now(timezone.utc)


def _grace_seconds():
    return int(current_app.config.get("REFRESH_REUSE_GRACE_SECONDS", DEFAULT_GRACE_SECONDS))


def _issue(user_id, family_id):
    """Create a refresh token and record it. The caller commits."""
    token = create_refresh_token(identity=str(user_id), additional_claims={"fam": family_id})
    payload = decode_token(token)
    db.session.add(
        RefreshToken(
            jti=payload["jti"],
            family_id=family_id,
            user_id=user_id,
            expires_at=datetime.fromtimestamp(payload["exp"], tz=timezone.utc),
        )
    )
    return token


def start_session(user_id):
    """First refresh token of a new login (new family). The caller commits."""
    return _issue(user_id, uuid.uuid4().hex)


def purge_expired_sessions():
    """Drop rows whose token has expired anyway. The caller commits."""
    RefreshToken.query.filter(RefreshToken.expires_at < _now()).delete(synchronize_session=False)


def revoke_family(family_id):
    RefreshToken.query.filter_by(family_id=family_id, revoked_at=None).update(
        {"revoked_at": _now()}, synchronize_session=False
    )


def rotate_refresh_token(jti):
    """Retire the token with this jti and return (new_refresh_token, user_id)."""
    rec = RefreshToken.query.filter_by(jti=jti).with_for_update().first()
    now = _now()

    if rec is None or rec.revoked_at is not None or rec.expires_at <= now:
        raise ApiError("Session expired. Please log in again.", 401, "token_revoked")

    if rec.rotated_at is None:
        rec.rotated_at = now
    elif (now - rec.rotated_at).total_seconds() > _grace_seconds():
        revoke_family(rec.family_id)
        db.session.commit()
        log.warning("refresh token reuse detected", extra={"user_id": rec.user_id})
        raise ApiError("Session expired. Please log in again.", 401, "token_revoked")

    new_token = _issue(rec.user_id, rec.family_id)
    db.session.commit()
    return new_token, rec.user_id


def revoke_session(jti):
    """Revoke the whole family of this token. Unknown tokens are ignored."""
    rec = RefreshToken.query.filter_by(jti=jti).first()
    if rec is not None:
        revoke_family(rec.family_id)
        db.session.commit()
