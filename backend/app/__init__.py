from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # Basic config (will expand later)
    app.config.from_object("app.config.Config")

    # Enable CORS
    CORS(app)

    # Register routes
    from app.routes.health import health_bp
    app.register_blueprint(health_bp)

    return app
