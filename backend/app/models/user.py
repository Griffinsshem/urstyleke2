from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(120), unique=True, nullable=False)

    password = db.Column(db.String(255), nullable=False)

    # Administrator flag. Never set from client input; promote users only
    # through a trusted server-side action (added in Milestone 1.2).
    is_admin = db.Column(
        db.Boolean, nullable=False, default=False, server_default=db.false()
    )
