from app.extensions import db


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(
        db.Integer,
        db.ForeignKey("orders.id"),
        nullable=False,
        index=True
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )

    title = db.Column(db.String(150), nullable=False)

    price = db.Column(db.Float, nullable=False)

    quantity = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<OrderItem {self.id} - Product {self.product_id}>"