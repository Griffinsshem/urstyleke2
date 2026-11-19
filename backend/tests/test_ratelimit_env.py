"""Rate-limit settings: unset or blank environment variables mean the default."""
from app.ratelimit import _env_or_default


def test_unset_variable_uses_default(monkeypatch):
    monkeypatch.delenv("RATELIMIT_TEST_KEY", raising=False)
    assert _env_or_default("RATELIMIT_TEST_KEY", "10 per hour") == "10 per hour"


def test_blank_variable_uses_default(monkeypatch):
    monkeypatch.setenv("RATELIMIT_TEST_KEY", "   ")
    assert _env_or_default("RATELIMIT_TEST_KEY", "10 per hour") == "10 per hour"


def test_set_variable_is_used_and_trimmed(monkeypatch):
    monkeypatch.setenv("RATELIMIT_TEST_KEY", " 5 per minute ")
    assert _env_or_default("RATELIMIT_TEST_KEY", "10 per hour") == "5 per minute"
