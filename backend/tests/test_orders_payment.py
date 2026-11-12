"""Orders can never be marked paid through the public API."""
import pytest
from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models.order import Order
from app.models.product import Product


@pytest.fixture()
def token_for(app):
    def _token(user_id):
        with app.app_context():
            return create_access_token(identity=str(user_id))

    return _token


@pytest.fixture()
def product_id(app):
    with app.app_context():
        p = Product(title="Tee", category="men", price=1000, image="/x.jpg")
        db.session.add(p)
        db.session.commit()
        return p.id


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def place_order(client, token, product_id, **extra):
    item = {"id": product_id, "quantity": 2, **extra}
    return client.post("/api/orders", json={"items": [item]}, headers=auth(token))


def order_status(app, order_id):
    with app.app_context():
        return db.session.get(Order, order_id).status


def test_pay_endpoint_no_longer_exists_for_owner(client, app, make_user, token_for, product_id):
    uid = make_user("buyer@example.com")
    token = token_for(uid)
    order_id = place_order(client, token, product_id).get_json()["order_id"]

    r = client.patch(f"/api/orders/{order_id}/pay", headers=auth(token))
    assert r.status_code in (404, 405)
    assert order_status(app, order_id) == "pending"


def test_pay_endpoint_no_longer_exists_for_admin(client, app, make_user, token_for, product_id):
    buyer = make_user("buyer@example.com")
    admin = make_user("boss@example.com", is_admin=True)
    order_id = place_order(client, token_for(buyer), product_id).get_json()["order_id"]

    r = client.patch(f"/api/orders/{order_id}/pay", headers=auth(token_for(admin)))
    assert r.status_code in (404, 405)
    assert order_status(app, order_id) == "pending"


def test_new_order_is_pending_and_ignores_client_price_and_status(
    client, app, make_user, token_for, product_id
):
    uid = make_user("buyer@example.com")
    r = client.post(
        "/api/orders",
        json={
            "status": "paid",
            "total_price": 1,
            "items": [{"id": product_id, "quantity": 2, "price": 1}],
        },
        headers=auth(token_for(uid)),
    )
    assert r.status_code == 201
    body = r.get_json()
    assert body["total_price"] == 2000  # 2 x 1000 from the database, not 1
    assert order_status(app, body["order_id"]) == "pending"
