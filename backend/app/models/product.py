from app.extensions import db


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(150), nullable=False)

    category = db.Column(db.String(50), nullable=False)

    price = db.Column(db.Integer, nullable=False)

    image = db.Column(db.String(255), nullable=False)

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )
