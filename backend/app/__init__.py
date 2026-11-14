from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from .config import Config
from .extensions import db, migrate
from .errors import register_error_handlers, register_jwt_error_handlers
from .observability import configure_logging, init_request_logging
from .proxy import apply_proxy_fix


jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    apply_proxy_fix(app)
    configure_logging(app)
    init_request_logging(app)

    CORS(
        app,
        resources={r"/api/*": {"origins": ["http://localhost:3000", "https://urstyleke2.vercel.app"]}},
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    )

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    register_jwt_error_handlers(jwt)
    register_error_handlers(app)


    from app.models.user import User
    from app.models.product import Product
    from app.models.order import Order

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.products import products_bp
    from .routes.orders import orders_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(orders_bp)

    from .cli import register_cli

    register_cli(app)

    # Health check
    @app.route("/")
    def home():
        return {"message": "UrStyleKE API running 🚀"}
    
    # @app.route("/cors-test")
    # def cors_test():
    #     return {"status": "latest backend deployed"}

    return app
