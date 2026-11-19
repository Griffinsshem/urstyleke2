from app.extensions import db

ORDER_STATUSES = (
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
)
_STATUS_SQL = ", ".join(f"'{s}'" for s in ORDER_STATUSES)


class Order(db.Model):
    __tablename__ = "orders"
    __table_args__ = (
        db.CheckConstraint(f"status IN ({_STATUS_SQL})", name="ck_orders_status"),
        db.CheckConstraint("total_price >= 0", name="ck_orders_total_price_nonneg"),
    )

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    # Whole Kenyan shillings.
    total_price = db.Column(db.Integer, nullable=False)

    status = db.Column(
        db.String(50),
        nullable=False,
        default="pending",
        server_default="pending"
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now()
    )

    items = db.relationship(
        "OrderItem",
        backref="order",
        cascade="all, delete-orphan",
        lazy=True
    )

    def __repr__(self):
        return f"<Order {self.id} - User {self.user_id} - Total {self.total_price}>"
