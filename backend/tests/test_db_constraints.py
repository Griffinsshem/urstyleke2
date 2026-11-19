"""Phase 3.1: the database itself enforces money, status and timestamp rules."""
import pytest
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

from app.extensions import db

EXPECTED_CHECKS = {
    "ck_orders_status",
    "ck_orders_total_price_nonneg",
    "ck_order_items_price_nonneg",
    "ck_order_items_quantity_positive",
    "ck_products_price_positive",
}

EXPECTED_TYPES = {
    ("orders", "total_price"): "integer",
    ("order_items", "price"): "integer",
    ("orders", "created_at"): "timestamp with time zone",
    ("products", "created_at"): "timestamp with time zone",
}


def test_check_constraints_exist(app):
    with app.app_context():
        rows = db.session.execute(
            text("select conname from pg_constraint where contype = 'c'")
        ).all()
    assert EXPECTED_CHECKS <= {r[0] for r in rows}


def test_money_and_time_column_types(app):
    with app.app_context():
        rows = db.session.execute(
            text(
                "select table_name, column_name, data_type "
                "from information_schema.columns where table_schema = 'public'"
            )
        ).all()
    types = {(t, c): d for t, c, d in rows}
    for key, expected in EXPECTED_TYPES.items():
        assert types[key] == expected, key


def test_product_price_must_be_positive(app):
    with app.app_context():
        with pytest.raises(IntegrityError):
            db.session.execute(
                text(
                    "insert into products (title, category, price, image) "
                    "values ('x', 'men', 0, '/i.jpg')"
                )
            )
        db.session.rollback()
