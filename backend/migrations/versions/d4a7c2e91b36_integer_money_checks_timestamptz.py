"""Phase 3.1: integer money, status and value checks, timestamptz created_at

Revision ID: d4a7c2e91b36
Revises: c3e8b1f45d72
"""
from alembic import op
import sqlalchemy as sa

revision = "d4a7c2e91b36"
down_revision = "c3e8b1f45d72"
branch_labels = None
depends_on = None

STATUSES = ("pending", "paid", "processing", "shipped", "delivered", "cancelled")
STATUS_SQL = ", ".join(f"'{s}'" for s in STATUSES)

# Rows that would break the new rules. Any hit aborts the migration untouched.
PREFLIGHT = {
    "orders with null or unknown status": (
        f"SELECT count(*) FROM orders WHERE status IS NULL OR status NOT IN ({STATUS_SQL})"
    ),
    "orders with null, negative or non-whole total_price": (
        "SELECT count(*) FROM orders "
        "WHERE total_price IS NULL OR total_price < 0 OR total_price <> round(total_price)"
    ),
    "orders with null created_at": "SELECT count(*) FROM orders WHERE created_at IS NULL",
    "order_items with null, negative or non-whole price": (
        "SELECT count(*) FROM order_items "
        "WHERE price IS NULL OR price < 0 OR price <> round(price)"
    ),
    "order_items with null or non-positive quantity": (
        "SELECT count(*) FROM order_items WHERE quantity IS NULL OR quantity <= 0"
    ),
    "products with non-positive price": "SELECT count(*) FROM products WHERE price <= 0",
    "products with null created_at": "SELECT count(*) FROM products WHERE created_at IS NULL",
}


def _preflight(bind):
    problems = []
    for label, sql in PREFLIGHT.items():
        count = bind.execute(sa.text(sql)).scalar()
        if count:
            problems.append(f"{label}: {count}")
    if problems:
        raise RuntimeError(
            "Migration d4a7c2e91b36 aborted, nothing was changed. Fix these rows first: "
            + "; ".join(problems)
        )


def upgrade():
    _preflight(op.get_bind())

    # Money: Float -> whole-shilling Integer, and never NULL.
    op.alter_column(
        "orders", "total_price",
        existing_type=sa.Float(), type_=sa.Integer(),
        postgresql_using="round(total_price)::integer",
    )
    op.alter_column("orders", "total_price", existing_type=sa.Integer(), nullable=False)
    op.alter_column(
        "order_items", "price",
        existing_type=sa.Float(), type_=sa.Integer(),
        postgresql_using="round(price)::integer",
    )
    op.alter_column("order_items", "price", existing_type=sa.Integer(), nullable=False)
    op.alter_column("order_items", "quantity", existing_type=sa.Integer(), nullable=False)

    # Status: fixed set, never NULL, DB-side default.
    op.alter_column(
        "orders", "status",
        existing_type=sa.String(length=50), nullable=False, server_default="pending",
    )

    # Timestamps: naive UTC -> timestamptz, NOT NULL, DB-side default.
    op.alter_column(
        "orders", "created_at",
        existing_type=sa.DateTime(), type_=sa.DateTime(timezone=True),
        postgresql_using="created_at AT TIME ZONE 'UTC'",
    )
    op.alter_column(
        "orders", "created_at",
        existing_type=sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now(),
    )
    op.alter_column(
        "products", "created_at",
        existing_type=sa.DateTime(), type_=sa.DateTime(timezone=True),
        postgresql_using="created_at AT TIME ZONE 'UTC'",
    )
    op.alter_column(
        "products", "created_at",
        existing_type=sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now(),
    )

    # Value rules.
    op.create_check_constraint("ck_orders_status", "orders", f"status IN ({STATUS_SQL})")
    op.create_check_constraint("ck_orders_total_price_nonneg", "orders", "total_price >= 0")
    op.create_check_constraint("ck_order_items_price_nonneg", "order_items", "price >= 0")
    op.create_check_constraint("ck_order_items_quantity_positive", "order_items", "quantity > 0")
    op.create_check_constraint("ck_products_price_positive", "products", "price > 0")


def downgrade():
    op.drop_constraint("ck_products_price_positive", "products", type_="check")
    op.drop_constraint("ck_order_items_quantity_positive", "order_items", type_="check")
    op.drop_constraint("ck_order_items_price_nonneg", "order_items", type_="check")
    op.drop_constraint("ck_orders_total_price_nonneg", "orders", type_="check")
    op.drop_constraint("ck_orders_status", "orders", type_="check")

    op.alter_column(
        "products", "created_at",
        existing_type=sa.DateTime(timezone=True), type_=sa.DateTime(),
        nullable=True, postgresql_using="created_at AT TIME ZONE 'UTC'",
    )
    op.alter_column(
        "orders", "created_at",
        existing_type=sa.DateTime(timezone=True), type_=sa.DateTime(),
        nullable=True, server_default=None, postgresql_using="created_at AT TIME ZONE 'UTC'",
    )
    op.alter_column(
        "orders", "status",
        existing_type=sa.String(length=50), nullable=True, server_default=None,
    )
    op.alter_column("order_items", "quantity", existing_type=sa.Integer(), nullable=True)
    op.alter_column(
        "order_items", "price",
        existing_type=sa.Integer(), type_=sa.Float(), nullable=True,
        postgresql_using="price::double precision",
    )
    op.alter_column(
        "orders", "total_price",
        existing_type=sa.Integer(), type_=sa.Float(), nullable=True,
        postgresql_using="total_price::double precision",
    )
