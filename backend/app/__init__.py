from flask import Flask
from flask_jwt_extended import JWTManager

from .config import Config
from .extensions import db, migrate


jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp)

    return app
