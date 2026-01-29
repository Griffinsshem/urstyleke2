from flask import Flask
from flask_cors import CORS
from .routes.auth import auth_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(auth_bp, url_prefix="/auth")

    @app.route("/")
    def home():
        return {"message": "UrStyleKE API running 🚀"}

    return app
