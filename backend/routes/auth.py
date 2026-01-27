from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # TEMP RESPONSE (DB comes next)
    return jsonify({
        "message": "User registered successfully",
        "user": {
            "name": name,
            "email": email
        }
    }), 201
