import os
from pathlib import Path
from datetime import timedelta

import jwt
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager

load_dotenv(
    dotenv_path=Path(__file__).resolve().parent.parent / ".env"
)

jwt = JWTManager()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    if not JWT_SECRET_KEY:
        raise RuntimeError(
            "JWT_SECRET_KEY is not set. "
            "Add it to your .env file before starting the server."
        )

    if len(JWT_SECRET_KEY) < 32:
        raise RuntimeError(
            f"JWT_SECRET_KEY is only {len(JWT_SECRET_KEY)} characters. "
            "It must be at least 32 characters."
        )

    DATABASE_URL = os.getenv("DATABASE_URL")

    if DATABASE_URL:
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        SQLALCHEMY_DATABASE_URI = "sqlite:///urstyleke.db"

    SQLALCHEMY_TRACK_MODIFICATIONS = False