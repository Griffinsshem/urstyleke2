"""Cookie transport for browser sessions: flags, CSRF, no tokens in bodies, logout."""

PW = "Passw0rd!test"
LOGIN = "/api/auth/login"
REFRESH = "/api/auth/refresh"
LOGOUT = "/api/auth/logout"
ME = "/api/auth/me"
ORDERS = "/api/orders"
COOKIE_MODE = {"X-Auth-Mode": "cookie"}

PATHS = {
    "access_token_cookie": "/api/",
    "refresh_token_cookie": "/api/auth/",
    "csrf_access_token": "/",
    "csrf_refresh_token": "/",
}


def login_cookie_mode(client, email):
    r = client.post(LOGIN, json={"email": email, "password": PW}, headers=COOKIE_MODE)
    assert r.status_code == 200
    return r


def cookie(client, name):
    c = client.get_cookie(name, path=PATHS[name])
    return c.value if c else None


def csrf_header(client, name):
    value = cookie(client, name)
    assert value, f"cookie {name} is missing"
    return {"X-CSRF-TOKEN": value}


def set_cookie_line(resp, name):
    for line in resp.headers.getlist("Set-Cookie"):
        if line.startswith(name + "="):
            return line.lower()
    return None


def attrs(line):
    out = {}
    for part in line.split(";")[1:]:
        key, _, value = part.strip().partition("=")
        out[key.lower()] = value
    return out


def test_cookie_login_sets_hardened_cookies_and_no_tokens_in_body(client, make_user):
    make_user("c1@example.com", password=PW)
    r = login_cookie_mode(client, "c1@example.com")

    body = r.get_json()
    assert "access_token" not in body and "refresh_token" not in body
    assert body["email"] == "c1@example.com"
    assert r.headers["Cache-Control"] == "no-store"

    access = attrs(set_cookie_line(r, "access_token_cookie"))
    assert "httponly" in access and "secure" in access
    assert access["samesite"] == "lax" and access["path"] == "/api/"
    assert access["max-age"] == "900"

    refresh = attrs(set_cookie_line(r, "refresh_token_cookie"))
    assert "httponly" in refresh and "secure" in refresh
    assert refresh["samesite"] == "lax" and refresh["path"] == "/api/auth/"
    assert refresh["max-age"] == str(7 * 24 * 3600)

    for name in ("csrf_access_token", "csrf_refresh_token"):
        line = set_cookie_line(r, name)
        assert line is not None
        assert "httponly" not in attrs(line)  # the page must be able to read these


def test_login_without_the_header_is_unchanged(client, make_user):
    make_user("c2@example.com", password=PW)
    r = client.post(LOGIN, json={"email": "c2@example.com", "password": PW})
    body = r.get_json()
    assert body["access_token"] and body["refresh_token"]
    assert cookie(client, "access_token_cookie") is None
    assert cookie(client, "refresh_token_cookie") is None


def test_cookies_alone_authenticate_a_read(client, make_user):
    make_user("c3@example.com", password=PW)
    login_cookie_mode(client, "c3@example.com")
    r = client.get(ME)
    assert r.status_code == 200
    assert r.get_json()["email"] == "c3@example.com"


def test_unsafe_methods_need_a_matching_csrf_header(client, make_user):
    make_user("c4@example.com", password=PW)
    login_cookie_mode(client, "c4@example.com")

    missing = client.post(ORDERS, json={"items": []})
    assert missing.status_code == 401
    assert missing.get_json()["code"] == "authorization_required"

    wrong = client.post(ORDERS, json={"items": []}, headers={"X-CSRF-TOKEN": "not-the-token"})
    assert wrong.status_code == 401

    ok = client.post(ORDERS, json={"items": []}, headers=csrf_header(client, "csrf_access_token"))
    # Authenticated and CSRF-checked; whatever the order validation says, it is not an auth failure.
    assert ok.status_code not in (401, 403) and ok.status_code < 500


def test_refresh_by_cookie_rotates_cookies_and_returns_no_tokens(client, make_user):
    make_user("c5@example.com", password=PW)
    login_cookie_mode(client, "c5@example.com")
    before = cookie(client, "refresh_token_cookie")

    r = client.post(REFRESH, headers=csrf_header(client, "csrf_refresh_token"))
    assert r.status_code == 200
    body = r.get_json()
    assert "access_token" not in body and "refresh_token" not in body
    assert r.headers["Cache-Control"] == "no-store"
    assert cookie(client, "refresh_token_cookie") not in (None, before)
    assert client.get(ME).status_code == 200


def test_a_cookie_refresh_cannot_ask_for_tokens_in_the_body(client, make_user):
    make_user("c6@example.com", password=PW)
    login_cookie_mode(client, "c6@example.com")
    headers = {**csrf_header(client, "csrf_refresh_token"), "X-Auth-Mode": "body"}
    r = client.post(REFRESH, headers=headers)
    assert r.status_code == 200
    assert "access_token" not in r.get_json() and "refresh_token" not in r.get_json()


def test_cookie_refresh_requires_the_csrf_header(client, make_user):
    make_user("c7@example.com", password=PW)
    login_cookie_mode(client, "c7@example.com")
    r = client.post(REFRESH)
    assert r.status_code == 401


def test_logout_clears_every_cookie_and_revokes_the_session(client, make_user):
    make_user("c8@example.com", password=PW)
    login_cookie_mode(client, "c8@example.com")
    refresh_value = cookie(client, "refresh_token_cookie")

    r = client.post(LOGOUT, headers=csrf_header(client, "csrf_refresh_token"))
    assert r.status_code == 200
    for name in PATHS:
        line = set_cookie_line(r, name)
        assert line is not None and "expires=thu, 01 jan 1970" in line, name

    assert client.get(ME).status_code == 401

    # The server side session is dead too, not just the browser's copy.
    reuse = client.post(REFRESH, headers={"Authorization": f"Bearer {refresh_value}"})
    assert reuse.status_code == 401
    assert reuse.get_json()["code"] == "token_revoked"


def test_logout_clears_cookies_even_when_the_token_is_junk(client):
    client.set_cookie("refresh_token_cookie", "junk", path="/api/auth/")
    r = client.post(LOGOUT)
    assert r.status_code in (401, 422)
    line = set_cookie_line(r, "refresh_token_cookie")
    assert line is not None and "expires=thu, 01 jan 1970" in line
