from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from app.extensions import db
from app.models.user import User


def admin_required(fn):
    """Allow a request only if it carries a valid access token that belongs
    to a user who is an administrator in the database right now.

    The role is read from the database on every call (not from the token),
    so removing someone's admin rights takes effect immediately.
    """

    @wraps(fn)
    def wrapper(*args, **kwargs):
        # Missing, expired or malformed tokens are answered by the JWT
        # error handlers registered in create_app (401 / 422).
        verify_jwt_in_request()

        try:
            user_id = int(get_jwt_identity())
        except (TypeError, ValueError):
            return jsonify({"error": "Authentication required"}), 401

        user = db.session.get(User, user_id)
        if user is None:
            return jsonify({"error": "Authentication required"}), 401
        if not user.is_admin:
            return jsonify({"error": "Administrator access required"}), 403

        return fn(*args, **kwargs)

    return wrapper
