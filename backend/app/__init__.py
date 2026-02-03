from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.extensions import db, migrate, jwt


def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)


    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from app import models

    # Register blueprints
    from app.routes.auth import auth_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")

    @app.route("/")
    def home():
        return {"message": "UrStyleKE API running 🚀"}

    return app
