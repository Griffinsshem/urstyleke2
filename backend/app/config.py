import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

    JWT_SECRET_KEY = os.getenv("SECRET_KEY")

    DB_TYPE = os.getenv("DB_TYPE", "sqlite")

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
