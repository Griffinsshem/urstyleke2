from app.extensions import db


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(150), nullable=False)

    description = db.Column(db.Text, nullable=True)

    price = db.Column(db.Float, nullable=False)

    image_url = db.Column(db.String(255), nullable=True)

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )
