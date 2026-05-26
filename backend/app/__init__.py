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
        resources={r"/api/*": {"origins": ["http://localhost:3000", "https://urstyleke.vercel.app"]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    )

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print("JWT INVALID:", error)
        return {"error": error}, 422
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        print("JWT MISSING:", error)
        return {"error": error}, 401


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

    # Health check
    @app.route("/")
    def home():
        return {"message": "UrStyleKE API running 🚀"}

    return app
