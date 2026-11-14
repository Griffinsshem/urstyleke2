"""Trusted proxy configuration.

TRUSTED_PROXY_HOPS is how many reverse proxies in front of the app we trust to
append to X-Forwarded-For. 0 (the default) trusts nothing: the connecting
address is used as-is. Anything above 0 makes Werkzeug's ProxyFix read the
client address that many entries from the right of the header, so a client
cannot choose its own address by sending a forged header.
"""
import os

from werkzeug.middleware.proxy_fix import ProxyFix

MAX_HOPS = 10


def trusted_proxy_hops():
    raw = os.environ.get("TRUSTED_PROXY_HOPS", "0").strip() or "0"
    try:
        hops = int(raw)
    except ValueError:
        raise RuntimeError("TRUSTED_PROXY_HOPS must be a whole number from 0 to 10")
    if not 0 <= hops <= MAX_HOPS:
        raise RuntimeError("TRUSTED_PROXY_HOPS must be a whole number from 0 to 10")
    return hops


def apply_proxy_fix(app):
    hops = trusted_proxy_hops()
    app.config["TRUSTED_PROXY_HOPS"] = hops
    if hops:
        app.wsgi_app = ProxyFix(
            app.wsgi_app, x_for=hops, x_proto=0, x_host=0, x_port=0, x_prefix=0
        )
