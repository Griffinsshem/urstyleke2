"""Test setup.

Safety rules enforced here:
  * Tests only ever run against TEST_DATABASE_URL (the Neon `test` branch).
  * If it points at the same host as DATABASE_URL (dev), pytest aborts.
  * The test database is emptied before every test, so never point it
    at data you care about.
"""
import os
from pathlib import Path
from urllib.parse import urlparse

import pytest
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BACKEND_DIR / ".env")


def _host(url):
    host = urlparse(url).hostname or ""
    return host.replace("-pooler", "")


_test_url = os.environ.get("TEST_DATABASE_URL", "")
if not _test_url:
    pytest.exit("TEST_DATABASE_URL is not set; refusing to run tests.", returncode=2)

_dev_url = os.environ.get("DATABASE_URL", "")
if _dev_url and _host(_dev_url) == _host(_test_url):
    pytest.exit(
        "TEST_DATABASE_URL points at the same database host as DATABASE_URL; "
        "refusing to run tests.",
        returncode=2,
    )

# Must happen BEFORE the app (and app.config) is imported.
os.environ["DATABASE_URL"] = _test_url

from flask_migrate import upgrade  # noqa: E402
from sqlalchemy import text  # noqa: E402
from werkzeug.security import generate_password_hash  # noqa: E402

from app import create_app  # noqa: E402
from app.extensions import db  # noqa: E402
from app.models.user import User  # noqa: E402


@pytest.fixture(scope="session")
def app():
    application = create_app()
    application.config["TESTING"] = True
    with application.app_context():
        upgrade(directory=str(BACKEND_DIR / "migrations"))
    return application


@pytest.fixture(autouse=True)
def clean_db(app):
    with app.app_context():
        db.session.execute(
            text(
                "TRUNCATE TABLE order_items, orders, products, users "
                "RESTART IDENTITY CASCADE"
            )
        )
        db.session.commit()
    yield


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def make_user(app):
    def _make(email, password="Passw0rd!test", is_admin=False):
        with app.app_context():
            user = User(
                email=email,
                password=generate_password_hash(password),
                is_admin=is_admin,
            )
            db.session.add(user)
            db.session.commit()
            return user.id

    return _make
