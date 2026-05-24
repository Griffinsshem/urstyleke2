from app.extensions import db
from datetime import datetime


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    total_price = db.Column(db.Float, nullable=False)

    status = db.Column(
        db.String(50),
        default="pending",
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    items = db.relationship(
        "OrderItem",
        backref="order",
        cascade="all, delete-orphan",
        lazy=True
    )

    def __repr__(self):
        return f"<Order {self.id} - User {self.user_id} - Total {self.total_price}>"