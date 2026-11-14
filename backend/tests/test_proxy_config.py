"""TRUSTED_PROXY_HOPS and the xff_hops log field (no database needed)."""
import logging

import pytest
from flask import request

from app import create_app


@pytest.fixture(autouse=True)
def clean_db():
    yield


def _request_records(caplog):
    return [r for r in caplog.records if r.name == "app.request"]


def test_logs_the_number_of_forwarded_entries_not_the_addresses(client, caplog):
    with caplog.at_level(logging.INFO, logger="app.request"):
        client.get("/", headers={"X-Forwarded-For": "203.0.113.7, 198.51.100.9"})
    record = _request_records(caplog)[-1]
    assert record.xff_hops == 2
    leaked = [v for v in vars(record).values() if "203.0.113.7" in str(v) or "198.51.100.9" in str(v)]
    assert leaked == []


def test_logs_zero_hops_when_the_header_is_absent(client, caplog):
    with caplog.at_level(logging.INFO, logger="app.request"):
        client.get("/")
    assert _request_records(caplog)[-1].xff_hops == 0


def _probe_app(monkeypatch, hops):
    monkeypatch.setenv("TRUSTED_PROXY_HOPS", hops)
    probe = create_app()
    probe.add_url_rule("/_ip", "ip_probe", lambda: request.remote_addr or "")
    return probe


@pytest.mark.parametrize(
    "hops,expected",
    [("0", "127.0.0.1"), ("1", "8.8.8.8"), ("2", "9.9.9.9")],
    ids=["trust-nothing", "one-hop", "two-hops"],
)
def test_client_address_is_read_from_the_right_of_the_header(monkeypatch, hops, expected):
    probe = _probe_app(monkeypatch, hops)
    r = probe.test_client().get("/_ip", headers={"X-Forwarded-For": "9.9.9.9, 8.8.8.8"})
    assert r.get_data(as_text=True) == expected
    assert probe.config["TRUSTED_PROXY_HOPS"] == int(hops)


def test_a_forged_left_entry_never_wins_with_one_trusted_hop(monkeypatch):
    probe = _probe_app(monkeypatch, "1")
    r = probe.test_client().get("/_ip", headers={"X-Forwarded-For": "6.6.6.6, 7.7.7.7"})
    assert r.get_data(as_text=True) == "7.7.7.7"


@pytest.mark.parametrize("value", ["abc", "-1", "11", "1.5"])
def test_invalid_hop_values_stop_the_app_from_starting(monkeypatch, value):
    monkeypatch.setenv("TRUSTED_PROXY_HOPS", value)
    with pytest.raises(RuntimeError):
        create_app()
