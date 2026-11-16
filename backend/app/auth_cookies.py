"""Cookie transport for browser sessions.

The auth routes always produce tokens in the JSON body, exactly as before. This layer
decides, per request, whether those tokens travel in httpOnly cookies instead:

* login:   only when the client asks with the header ``X-Auth-Mode: cookie``.
* refresh: only when the refresh token itself arrived in a cookie. A client cannot ask
           for tokens in the body on a cookie-authenticated request, so script injected
           into a page cannot read a fresh token out of a refresh response.
* logout:  always clears the cookies, even when the token was already invalid, because
           JavaScript cannot delete httpOnly cookies itself.

Header-authenticated clients (scripts, the test-suite) are unchanged and are exempt from
CSRF checks, because a browser never attaches an Authorization header by itself.
"""
import json

from flask import current_app, request
from flask_jwt_extended import (
    get_jwt_request_location,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
)

LOGIN = "/api/auth/login"
REFRESH = "/api/auth/refresh"
LOGOUT = "/api/auth/logout"


def _seconds(key):
    return int(current_app.config[key].total_seconds())


def _wants_cookies(path):
    if path == LOGIN:
        return request.headers.get("X-Auth-Mode", "").strip().lower() == "cookie"
    if path == REFRESH:
        return get_jwt_request_location() == "cookies"
    return False


def init_auth_cookies(app):
    @app.after_request
    def _auth_cookie_transport(response):
        if request.method != "POST":
            return response

        path = request.path.rstrip("/")
        if path not in (LOGIN, REFRESH, LOGOUT):
            return response

        # Responses that carry or clear credentials must never be cached.
        response.headers["Cache-Control"] = "no-store"

        if path == LOGOUT:
            if response.status_code in (200, 401, 422):
                unset_jwt_cookies(response)
            return response

        if response.status_code == 200 and _wants_cookies(path):
            data = json.loads(response.get_data(as_text=True))
            access = data.pop("access_token", None)
            refresh = data.pop("refresh_token", None)
            if access:
                set_access_cookies(response, access, max_age=_seconds("JWT_ACCESS_TOKEN_EXPIRES"))
            if refresh:
                set_refresh_cookies(response, refresh, max_age=_seconds("JWT_REFRESH_TOKEN_EXPIRES"))
            response.set_data(json.dumps(data))

        return response
