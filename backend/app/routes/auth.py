from flask import Blueprint, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash

from ..errors import ApiError, error_response
from ..extensions import db
from ..models.user import User
from ..schemas import LoginRequest, ProfileUpdateRequest, RegisterRequest, check_password
from ..validation import parse_body


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Compared against when the email is unknown, so a login attempt costs the same
# whether or not the account exists (no timing leak).
_DUMMY_HASH = generate_password_hash("dummy-password-for-timing-only")


def _find_user_by_email(email):
    return User.query.filter(db.func.lower(User.email) == email).first()


# Register
@auth_bp.route("/register", methods=["POST"])
def register():
    body = parse_body(RegisterRequest)

    if _find_user_by_email(body.email):
        return error_response("User already exists", 409, "email_taken")

    user = User(email=body.email, password=generate_password_hash(body.password))
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return error_response("User already exists", 409, "email_taken")

    return jsonify({"message": "User registered successfully"}), 201


# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    body = parse_body(LoginRequest)

    user = _find_user_by_email(body.email)
    password_ok = check_password_hash(user.password if user else _DUMMY_HASH, body.password)

    if not user or not password_ok:
        return error_response("Invalid credentials", 401, "invalid_credentials")

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user_id": user.id,
        "email": user.email,
    }), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user = db.session.get(User, int(get_jwt_identity()))

    if not user:
        return error_response("User not found", 404, "user_not_found")

    return jsonify({"id": user.id, "email": user.email}), 200


# Update profile
@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    body = parse_body(ProfileUpdateRequest)

    user = db.session.get(User, int(get_jwt_identity()))

    if not user:
        return error_response("User not found", 404, "user_not_found")

    if body.password is not None:
        problem = check_password(body.password, user.email)
        if problem:
            raise ApiError(problem, 422, "validation_error", fields={"password": problem})
        user.password = generate_password_hash(body.password)

    db.session.commit()

    return jsonify({"message": "Profile updated"}), 200


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()

    return jsonify({"access_token": create_access_token(identity=str(user_id))}), 200
