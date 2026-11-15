from sqlalchemy import func

from app.extensions import db


class RefreshToken(db.Model):
    """One row per issued refresh token. Tokens in one login share a family_id so a
    whole session can be revoked at once (logout, or reuse of a retired token)."""

    __tablename__ = "refresh_tokens"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(64), unique=True, nullable=False, index=True)
    family_id = db.Column(db.String(64), nullable=False, index=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at = db.Column(db.DateTime(timezone=True), nullable=False, index=True)
    rotated_at = db.Column(db.DateTime(timezone=True))
    revoked_at = db.Column(db.DateTime(timezone=True))
