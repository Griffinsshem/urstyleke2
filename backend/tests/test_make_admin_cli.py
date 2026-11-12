from app.extensions import db
from app.models.user import User


def test_make_admin_promotes_user_case_insensitively(app, make_user):
    uid = make_user("boss@example.com")
    result = app.test_cli_runner().invoke(args=["make-admin", "  Boss@Example.COM "])
    assert result.exit_code == 0, result.output
    assert "now an administrator" in result.output
    with app.app_context():
        assert db.session.get(User, uid).is_admin is True


def test_make_admin_unknown_email_fails_and_changes_nothing(app, make_user):
    uid = make_user("shopper@example.com")
    result = app.test_cli_runner().invoke(args=["make-admin", "nobody@example.com"])
    assert result.exit_code != 0
    assert "No user with email" in result.output
    with app.app_context():
        assert db.session.get(User, uid).is_admin is False
