"""Registration/login input that is rejected before the database is touched."""
import pytest


@pytest.fixture(autouse=True)
def clean_db():
    yield


GOOD_PW = "Passw0rd!test"
REGISTER = "/api/auth/register"
LOGIN = "/api/auth/login"


@pytest.mark.parametrize(
    "password",
    ["Short1!", "password123", "aaaaaaaaaaaa", "x" * 129],
    ids=["too-short", "common", "one-repeated-char", "too-long"],
)
def test_register_rejects_weak_passwords(client, password):
    r = client.post(REGISTER, json={"email": "weak@example.com", "password": password})
    body = r.get_json()
    assert r.status_code == 422
    assert body["code"] == "validation_error"
    assert "password" in body["fields"]
    assert body["error"] == body["fields"]["password"]


def test_register_rejects_password_equal_to_email(client):
    email = "samepassword@example.com"
    r = client.post(REGISTER, json={"email": email, "password": email})
    assert r.status_code == 422
    assert "password" in r.get_json()["fields"]


@pytest.mark.parametrize("email", ["no-at-sign", "a@b", "has space@x.com", "@x.com"])
def test_register_rejects_invalid_emails(client, email):
    r = client.post(REGISTER, json={"email": email, "password": GOOD_PW})
    assert r.status_code == 422
    assert "email" in r.get_json()["fields"]


@pytest.mark.parametrize(
    "body,field",
    [
        ({"email": "a@b.co"}, "password"),
        ({"password": GOOD_PW}, "email"),
        ({"email": 123, "password": GOOD_PW}, "email"),
        ({"email": "a@b.co", "password": 12345678901}, "password"),
    ],
    ids=["no-password", "no-email", "email-not-text", "password-not-text"],
)
def test_register_rejects_missing_or_wrongly_typed_fields(client, body, field):
    r = client.post(REGISTER, json=body)
    assert r.status_code == 422
    assert field in r.get_json()["fields"]


@pytest.mark.parametrize("url", [REGISTER, LOGIN])
def test_non_object_json_body_is_400(client, url):
    r = client.post(url, data="[1]", content_type="application/json")
    assert r.status_code == 400
    assert r.get_json()["code"] == "invalid_json"


def test_login_without_password_is_a_validation_error(client):
    r = client.post(LOGIN, json={"email": "x@example.com"})
    assert r.status_code == 422
    assert "password" in r.get_json()["fields"]
