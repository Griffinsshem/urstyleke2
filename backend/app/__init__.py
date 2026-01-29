from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    # basic health check
    @app.route("/")
    def home():
        return {"message": "UrStyleKE API running 🚀"}

    return app
