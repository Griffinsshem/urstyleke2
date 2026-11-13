"""Product and order bodies are validated; unknown fields can never be set."""
import uuid

import pytest
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

from app.extensions import db
from app.models.product import Product
from app.models.user import User


@pytest.fixture(autouse=True)
def clean_db():
    """One shared admin and buyer per module (unique emails), so no per-test truncate."""
    yield


def _headers(app, is_admin):
    with app.app_context():
        user = User(
            email=f"{uuid.uuid4().hex[:10]}@example.com",
            password=generate_password_hash("Passw0rd!test"),
            is_admin=is_admin,
        )
        db.session.add(user)
        db.session.commit()
        return {"Authorization": f"Bearer {create_access_token(identity=str(user.id))}"}


@pytest.fixture(scope="module")
def admin_headers(app):
    return _headers(app, True)


@pytest.fixture(scope="module")
def buyer_headers(app):
    return _headers(app, False)


def make_product(app, title="Original", price=1000):
    with app.app_context():
        p = Product(title=title, category="men", price=price, image="/x.jpg")
        db.session.add(p)
        db.session.commit()
        return p.id


def load(app, pid):
    with app.app_context():
        return db.session.get(Product, pid)


GOOD = {"title": "Tee", "price": 100, "category": "men"}


@pytest.mark.parametrize(
    "body,field",
    [
        ({**GOOD, "price": 0}, "price"),
        ({**GOOD, "price": -5}, "price"),
        ({**GOOD, "price": "abc"}, "price"),
        ({**GOOD, "price": 12.5}, "price"),
        ({**GOOD, "title": ""}, "title"),
        ({**GOOD, "title": "x" * 151}, "title"),
        ({"title": "Tee", "price": 100}, "category"),
        ({"price": 100, "category": "men"}, "title"),
    ],
    ids=["price-zero", "price-negative", "price-text", "price-fraction",
         "title-empty", "title-too-long", "no-category", "no-title"],
)
def test_create_product_rejects_invalid_input(client, admin_headers, body, field):
    r = client.post("/api/products/", json=body, headers=admin_headers)
    assert r.status_code == 422
    assert field in r.get_json()["fields"]


def test_create_product_ignores_unknown_fields(client, admin_headers):
    r = client.post(
        "/api/products/",
        json={**GOOD, "id": 999999, "created_at": "1999-01-01"},
        headers=admin_headers,
    )
    assert r.status_code == 201
    assert r.get_json()["id"] != 999999


def test_update_with_invalid_price_changes_nothing(client, app, admin_headers):
    pid = make_product(app)
    r = client.put(f"/api/products/{pid}", json={"price": -1}, headers=admin_headers)
    assert r.status_code == 422
    assert load(app, pid).price == 1000


def test_update_can_change_just_one_field(client, app, admin_headers):
    pid = make_product(app)
    r = client.put(f"/api/products/{pid}", json={"price": 2500}, headers=admin_headers)
    assert r.status_code == 200
    product = load(app, pid)
    assert product.price == 2500
    assert product.title == "Original"


def test_update_ignores_unknown_fields(client, app, admin_headers):
    pid = make_product(app)
    r = client.put(
        f"/api/products/{pid}", json={"id": 424242, "title": "Renamed"}, headers=admin_headers
    )
    assert r.status_code == 200
    assert r.get_json()["id"] == pid
    assert load(app, pid).title == "Renamed"


@pytest.mark.parametrize(
    "body",
    [
        {"items": []},
        {},
        {"items": [{"id": 1, "quantity": 0}]},
        {"items": [{"id": 1, "quantity": 101}]},
        {"items": [{"id": 1, "quantity": "abc"}]},
        {"items": [{"quantity": 1}]},
        {"items": [{"id": 0, "quantity": 1}]},
    ],
    ids=["empty-cart", "no-items-key", "quantity-zero", "quantity-too-large",
         "quantity-text", "missing-id", "id-zero"],
)
def test_create_order_rejects_invalid_input(client, buyer_headers, body):
    r = client.post("/api/orders", json=body, headers=buyer_headers)
    assert r.status_code == 422
    assert any(key.startswith("items") for key in r.get_json()["fields"])


def test_order_for_unknown_product_is_a_404(client, buyer_headers):
    r = client.post(
        "/api/orders", json={"items": [{"id": 99999999, "quantity": 1}]}, headers=buyer_headers
    )
    assert r.status_code == 404
    assert r.get_json()["code"] == "product_not_found"
