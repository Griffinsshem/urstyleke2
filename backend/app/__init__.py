from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from .config import Config
from .extensions import db, migrate


jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend (Next.js)
    CORS(
        app,
        resources={r"/api/*": {"origins": "http://localhost:3000"}},
        supports_credentials=True
    )

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register blueprints
    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    # Health check
    @app.route("/")
    def home():
        return {"message": "UrStyleKE API running 🚀"}

    return app
