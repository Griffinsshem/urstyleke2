from functools import wraps

from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from app.errors import error_response
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
            return error_response("Authentication required", 401, "authentication_required")

        user = db.session.get(User, user_id)
        if user is None:
            return error_response("Authentication required", 401, "authentication_required")
        if not user.is_admin:
            return error_response("Administrator access required", 403, "admin_required")

        return fn(*args, **kwargs)

    return wrapper
