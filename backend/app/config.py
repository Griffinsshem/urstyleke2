import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    if not JWT_SECRET_KEY:
        raise RuntimeError(
            "JWT_SECRET_KEY is not set. "
            "Add it to your .env file before starting the server."
        )

    if len(JWT_SECRET_KEY) < 32:
        raise RuntimeError(
            f"JWT_SECRET_KEY is only {len(JWT_SECRET_KEY)} characters. "
            "It must be at least 32 characters. "
            "Run: python -c \"import secrets; print(secrets.token_hex(32))\""
        )

    DB_TYPE = os.getenv("DB_TYPE", "sqlite").lower()

    if DB_TYPE == "sqlite":
        SQLALCHEMY_DATABASE_URI = "sqlite:///urstyleke.db"
    else:
        SQLALCHEMY_DATABASE_URI = (
            f"postgresql://{os.getenv('DB_USER')}:"
            f"{os.getenv('DB_PASSWORD')}@"
            f"{os.getenv('DB_HOST')}:"
            f"{os.getenv('DB_PORT')}/"
            f"{os.getenv('DB_NAME')}"
        )

    SQLALCHEMY_TRACK_MODIFICATIONS = False