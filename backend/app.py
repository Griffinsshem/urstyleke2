from flask import Flask, jsonify
from flask_cors import CORS
from auth import auth_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp)

@app.route("/")
def home():
    return jsonify({"message": "UrStyleKE API running 🚀"})
