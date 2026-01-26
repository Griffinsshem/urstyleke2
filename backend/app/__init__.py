from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    from app.auth import auth_bp
    app.register_blueprint(auth_bp)

    @app.route("/")
    def home():
        return {"message": "UrStyleKE API running 🚀"}

    return app
