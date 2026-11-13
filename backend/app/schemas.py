"""Request schemas (Pydantic v2).

Unknown fields are ignored, so a client can never set things like is_admin or
id through these endpoints.
"""
import re
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

MIN_PASSWORD = 10
MAX_PASSWORD = 128

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

# Very common passwords that would otherwise satisfy the length rule.
_COMMON_PASSWORDS = {
    "password123", "password1234", "password12345", "passw0rd123", "password@123",
    "1234567890", "12345678910", "0123456789", "9876543210", "1111111111", "0000000000",
    "qwertyuiop", "qwerty12345", "qwerty123456", "1q2w3e4r5t", "abcdefghij", "abc1234567",
    "iloveyou123", "welcome123", "welcome1234", "letmein1234", "admin12345", "administrator",
    "changeme123", "football123", "monkey1234", "dragon1234", "superman123", "trustno1234",
}


def check_password(password, email=None):
    """Return a human-readable problem with `password`, or None if it is acceptable."""
    if len(password) < MIN_PASSWORD:
        return f"Password must be at least {MIN_PASSWORD} characters long"
    if len(password) > MAX_PASSWORD:
        return f"Password must be at most {MAX_PASSWORD} characters long"
    if len(set(password)) == 1:
        return "Password must not be a single repeated character"
    if password.lower() in _COMMON_PASSWORDS:
        return "Password is too common; choose something harder to guess"
    if email and password.lower() == email.lower():
        return "Password must not be the same as your email"
    return None


class _Base(BaseModel):
    model_config = ConfigDict(extra="ignore")


class RegisterRequest(_Base):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def _normalize_email(cls, value):
        value = value.strip().lower()
        if len(value) > 120 or not _EMAIL_RE.match(value):
            raise ValueError("Enter a valid email address")
        return value

    @field_validator("password")
    @classmethod
    def _check_password(cls, value, info):
        problem = check_password(value, info.data.get("email"))
        if problem:
            raise ValueError(problem)
        return value


class LoginRequest(_Base):
    """Login is deliberately lenient about the password so older accounts still work."""

    email: str
    password: str

    @field_validator("email")
    @classmethod
    def _normalize_email(cls, value):
        value = value.strip().lower()
        if not value or len(value) > 254:
            raise ValueError("Enter a valid email address")
        return value

    @field_validator("password")
    @classmethod
    def _password_present(cls, value):
        if not value:
            raise ValueError("Password is required")
        if len(value) > 256:
            raise ValueError("Password is too long")
        return value


class ProfileUpdateRequest(_Base):
    password: Optional[str] = None

    @field_validator("password", mode="before")
    @classmethod
    def _blank_means_unchanged(cls, value):
        return None if isinstance(value, str) and value == "" else value


class _Product(_Base):
    model_config = ConfigDict(extra="ignore", str_strip_whitespace=True)


class ProductCreateRequest(_Product):
    title: str = Field(min_length=1, max_length=150)
    category: str = Field(min_length=1, max_length=50)
    price: int = Field(ge=1, le=10_000_000)
    image: Optional[str] = Field(default=None, max_length=255)


class ProductUpdateRequest(_Product):
    title: Optional[str] = Field(default=None, min_length=1, max_length=150)
    category: Optional[str] = Field(default=None, min_length=1, max_length=50)
    price: Optional[int] = Field(default=None, ge=1, le=10_000_000)
    image: Optional[str] = Field(default=None, min_length=1, max_length=255)


class OrderItemIn(_Base):
    id: int = Field(ge=1)
    quantity: int = Field(default=1, ge=1, le=100)


class OrderCreateRequest(_Base):
    items: list[OrderItemIn] = Field(min_length=1, max_length=50)
