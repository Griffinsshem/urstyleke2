"""Application configuration.

Every secret comes from environment variables. Nothing here has a default
value, so a missing or weak secret stops the app at startup instead of
silently running with something guessable.
"""

import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

# Local development: read backend/.env. Variables already set in the real
# environment (for example on Render) always win, because override is False.
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

MIN_SECRET_LENGTH = 32
PLACEHOLDER_SECRETS = {"dev-secret", "jwt-dev-secret", "changeme", "change-me"}


def _env(name):
    return os.getenv(name, "").strip()


def _require_secret(name):
    value = _env(name)
    if not value:
        raise RuntimeError(
            f"{name} is not set. Add it to backend/.env (local) or to the "
            "host's environment variables (production)."
        )
    if len(value) < MIN_SECRET_LENGTH or value.lower() in PLACEHOLDER_SECRETS:
        raise RuntimeError(
            f"{name} is too weak. Use at least {MIN_SECRET_LENGTH} random "
            "characters; see backend/.env.example for how to generate one."
        )
    return value


def _require_database_url():
    url = _env("DATABASE_URL")
    if not url:
        raise RuntimeError(
            "DATABASE_URL is not set. Add your PostgreSQL connection string "
            "to backend/.env (local) or to the host's environment variables."
        )
    # Some hosts still use the old "postgres://" scheme, which SQLAlchemy 2 rejects.
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://"):]
    if not url.startswith("postgresql"):
        raise RuntimeError("DATABASE_URL must be a PostgreSQL URL (postgresql://...).")
    return url


class Config:
    SECRET_KEY = _require_secret("SECRET_KEY")
    JWT_SECRET_KEY = _require_secret("JWT_SECRET_KEY")

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    SQLALCHEMY_DATABASE_URI = _require_database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Neon suspends idle compute, which can leave pooled connections stale.
    # pre_ping tests a connection before use; recycle stays under the 5 minute
    # suspend time. Small pool: Render's free instance is a single small process.
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "hide_parameters": True,
        "hide_parameters": True,
        "pool_recycle": 280,
        "pool_size": 5,
        "max_overflow": 5,
        "connect_args": {"connect_timeout": 15},
    }
