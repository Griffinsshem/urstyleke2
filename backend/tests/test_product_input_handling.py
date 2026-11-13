"""Bad request bodies on product writes give clean 400s, never crashes."""
import pytest
from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models.product import Product


@pytest.fixture()
def admin_headers(app, make_user):
    uid = make_user("boss@example.com", is_admin=True)
    with app.app_context():
        token = create_access_token(identity=str(uid))
    return {"Authorization": f"Bearer {token}"}


def product_count(app):
    with app.app_context():
        return Product.query.count()


BAD_BODIES = [
    pytest.param({}, id="no-body"),
    pytest.param({"data": "not json", "content_type": "text/plain"}, id="plain-text"),
    pytest.param({"data": "[1, 2]", "content_type": "application/json"}, id="json-list"),
    pytest.param({"data": "null", "content_type": "application/json"}, id="json-null"),
]


@pytest.mark.parametrize("body", BAD_BODIES)
def test_create_with_bad_body_is_400_and_creates_nothing(client, app, admin_headers, body):
    r = client.post("/api/products/", headers=admin_headers, **body)
    assert r.status_code == 400
    assert r.get_json()["code"] == "invalid_json"
    assert product_count(app) == 0


def test_create_without_title_is_a_validation_error(client, app, admin_headers):
    r = client.post("/api/products/", json={"price": 100}, headers=admin_headers)
    assert r.status_code == 422
    assert r.get_json()["code"] == "validation_error"
    assert product_count(app) == 0


def test_update_with_null_body_is_400_and_changes_nothing(client, app, admin_headers):
    with app.app_context():
        p = Product(title="Original", category="men", price=1000, image="/x.jpg")
        db.session.add(p)
        db.session.commit()
        pid = p.id
    r = client.put(
        f"/api/products/{pid}", data="null", content_type="application/json", headers=admin_headers
    )
    assert r.status_code == 400
    assert r.get_json()["code"] == "invalid_json"
    with app.app_context():
        assert db.session.get(Product, pid).title == "Original"
