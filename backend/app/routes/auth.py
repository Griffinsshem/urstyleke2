from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from ..extensions import db
from ..models.user import User


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# Register
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 409

    user = User(
        email=email,
        password=generate_password_hash(password)
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({
        "access_token": token,
        "user_id": user.id,
        "email": user.email
    }), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return {"error": "User not found"}, 404

    return {
        "id": user.id,
        "email": user.email,
    }, 200

# Update profile
@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()

    data = request.get_json()
    password = data.get("password")

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if password:
        user.password = generate_password_hash(password)

    db.session.commit()

    return jsonify({"message": "Profile updated"}), 200
