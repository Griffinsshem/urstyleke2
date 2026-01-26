from flask import request, jsonify
from passlib.hash import bcrypt
from . import auth_bp

# TEMP in-memory store (Postgres comes next)
USERS = []


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password or not name:
        return jsonify({"error": "All fields are required"}), 400

    if any(user["email"] == email for user in USERS):
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = bcrypt.hash(password)

    USERS.append({
        "name": name,
        "email": email,
        "password": hashed_password
    })

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    email = data.get("email")
    password = data.get("password")

    user = next((u for u in USERS if u["email"] == email), None)

    if not user or not bcrypt.verify(password, user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "email": user["email"],
            "name": user["name"]
        }
    })
