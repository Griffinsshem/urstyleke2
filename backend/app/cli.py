import click

from app.extensions import db
from app.models.user import User


def register_cli(app):
    @app.cli.command("make-admin")
    @click.argument("email")
    def make_admin(email):
        """Promote an existing user to administrator."""
        email = email.strip().lower()
        user = User.query.filter(db.func.lower(User.email) == email).first()

        if user is None:
            raise click.ClickException(f"No user with email {email!r}. Register first.")
        if user.is_admin:
            click.echo(f"{email} is already an administrator.")
            return

        user.is_admin = True
        db.session.commit()
        click.echo(f"{email} is now an administrator.")
