"""Product writes must be admin-only; reads stay public."""
import pytest
from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models.product import Product
from app.models.user import User

PRODUCTS = "/api/products"
NEW_PRODUCT = {"title": "Test Tee", "price": 1500, "category": "men"}


@pytest.fixture()
def token_for(app):
    def _token(user_id):
        with app.app_context():
            return create_access_token(identity=str(user_id))

    return _token


@pytest.fixture()
def product_id(app):
    with app.app_context():
        p = Product(title="Original", category="men", price=1000, image="/x.jpg")
        db.session.add(p)
        db.session.commit()
        return p.id


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def product_count(app):
    with app.app_context():
        return Product.query.count()


def product_title(app, pid):
    with app.app_context():
        p = db.session.get(Product, pid)
        return p.title if p else None


# ---- anonymous -------------------------------------------------------------

@pytest.mark.parametrize("url", [PRODUCTS, PRODUCTS + "/"])
def test_anonymous_cannot_create(client, app, url):
    r = client.post(url, json=NEW_PRODUCT)
    assert r.status_code == 401
    assert product_count(app) == 0


def test_anonymous_cannot_update(client, app, product_id):
    r = client.put(f"{PRODUCTS}/{product_id}", json={"title": "Hacked"})
    assert r.status_code == 401
    assert product_title(app, product_id) == "Original"


def test_anonymous_cannot_delete(client, app, product_id):
    r = client.delete(f"{PRODUCTS}/{product_id}")
    assert r.status_code == 401
    assert product_title(app, product_id) == "Original"


# ---- normal (non-admin) user ----------------------------------------------

@pytest.mark.parametrize("url", [PRODUCTS, PRODUCTS + "/"])
def test_normal_user_cannot_create(client, app, make_user, token_for, url):
    uid = make_user("shopper@example.com")
    r = client.post(url, json=NEW_PRODUCT, headers=auth(token_for(uid)))
    assert r.status_code == 403
    assert product_count(app) == 0


def test_normal_user_cannot_update(client, app, make_user, token_for, product_id):
    uid = make_user("shopper@example.com")
    r = client.put(
        f"{PRODUCTS}/{product_id}",
        json={"title": "Hacked"},
        headers=auth(token_for(uid)),
    )
    assert r.status_code == 403
    assert product_title(app, product_id) == "Original"


def test_normal_user_cannot_delete(client, app, make_user, token_for, product_id):
    uid = make_user("shopper@example.com")
    r = client.delete(f"{PRODUCTS}/{product_id}", headers=auth(token_for(uid)))
    assert r.status_code == 403
    assert product_title(app, product_id) == "Original"


# ---- admin -----------------------------------------------------------------

def test_admin_can_create(client, app, make_user, token_for):
    uid = make_user("boss@example.com", is_admin=True)
    r = client.post(PRODUCTS, json=NEW_PRODUCT, headers=auth(token_for(uid)))
    assert r.status_code == 201
    assert product_count(app) == 1


def test_admin_can_update(client, app, make_user, token_for, product_id):
    uid = make_user("boss@example.com", is_admin=True)
    r = client.put(
        f"{PRODUCTS}/{product_id}",
        json={"title": "Renamed", "price": 2000, "category": "men"},
        headers=auth(token_for(uid)),
    )
    assert r.status_code == 200
    assert product_title(app, product_id) == "Renamed"


def test_admin_can_delete(client, app, make_user, token_for, product_id):
    uid = make_user("boss@example.com", is_admin=True)
    r = client.delete(f"{PRODUCTS}/{product_id}", headers=auth(token_for(uid)))
    assert r.status_code in (200, 204)
    assert product_title(app, product_id) is None


# ---- reads stay public -----------------------------------------------------

def test_product_list_is_public(client, product_id):
    assert client.get(PRODUCTS + "/").status_code == 200


def test_product_detail_is_public(client, product_id):
    assert client.get(f"{PRODUCTS}/{product_id}").status_code == 200


# ---- token edge cases ------------------------------------------------------

def test_token_for_deleted_user_is_rejected(client, app, make_user, token_for):
    uid = make_user("gone@example.com", is_admin=True)
    token = token_for(uid)
    with app.app_context():
        db.session.delete(db.session.get(User, uid))
        db.session.commit()
    r = client.post(PRODUCTS, json=NEW_PRODUCT, headers=auth(token))
    assert r.status_code == 401
    assert product_count(app) == 0


def test_demoted_admin_loses_access_immediately(client, app, make_user, token_for):
    uid = make_user("exboss@example.com", is_admin=True)
    token = token_for(uid)
    with app.app_context():
        db.session.get(User, uid).is_admin = False
        db.session.commit()
    r = client.post(PRODUCTS, json=NEW_PRODUCT, headers=auth(token))
    assert r.status_code == 403


# ---- privilege escalation via registration --------------------------------

def test_register_cannot_create_admin(client, app):
    r = client.post(
        "/api/auth/register",
        json={
            "email": "sneaky@example.com",
            "password": "Passw0rd!test",
            "is_admin": True,
        },
    )
    assert r.status_code in (200, 201), r.get_data(as_text=True)
    with app.app_context():
        user = User.query.filter_by(email="sneaky@example.com").first()
        assert user is not None
        assert user.is_admin is False
