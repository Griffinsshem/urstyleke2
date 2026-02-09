from app.extensions import db
from datetime import datetime


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)

    # Foreign Keys
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )

    quantity = db.Column(db.Integer, default=1, nullable=False)

    total_price = db.Column(db.Float, nullable=False)

    status = db.Column(db.String(50), default="pending")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship("User", backref="orders")
    product = db.relationship("Product", backref="orders")

    def __repr__(self):
        return f"<Order {self.id} - User {self.user_id} - Product {self.product_id}>"
