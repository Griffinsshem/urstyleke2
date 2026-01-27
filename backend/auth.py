from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

# TEMP in-memory users (Postgres later)
users = []

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if any(user["email"] == email for user in users):
        return jsonify({"error": "Email already registered"}), 409

    users.append({
        "name": name,
        "email": email,
        "password": password  # hashing later
    })

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = next(
        (u for u in users if u["email"] == email and u["password"] == password),
        None
    )

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "name": user["name"],
            "email": user["email"]
        }
    }), 200
