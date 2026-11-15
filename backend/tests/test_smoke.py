from sqlalchemy import text

from app.extensions import db


def test_api_root_responds(client):
    assert client.get("/").status_code == 200


def test_migrations_applied_and_tables_empty(app):
    with app.app_context():
        assert db.session.execute(text("SELECT count(*) FROM users")).scalar() == 0
        assert db.session.execute(text("SELECT count(*) FROM products")).scalar() == 0
        version = db.session.execute(
            text("SELECT version_num FROM alembic_version")
        ).scalar()
        from pathlib import Path as _Path
        from alembic.config import Config
        from alembic.script import ScriptDirectory

        cfg = Config()
        cfg.set_main_option(
            "script_location",
            str(_Path(__file__).resolve().parent.parent / "migrations"),
        )
        assert version == ScriptDirectory.from_config(cfg).get_current_head()
