from flask import Flask, jsonify
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["SECRET_KEY"] = "dev-secret-key"

    @app.route("/")
    def home():
        return jsonify({"message": "UrStyleKE API running 🚀"})

    # REGISTER AUTH ROUTES
    from routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/auth")

    return app
