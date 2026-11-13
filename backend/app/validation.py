"""Parse and validate a JSON request body against a Pydantic model."""
from flask import request
from pydantic import ValidationError

from app.errors import ApiError


def _label(loc):
    names = [str(p) for p in loc if not isinstance(p, int)]
    return (names[-1] if names else "request").replace("_", " ").capitalize()


def _message(err):
    label = _label(err.get("loc", ()))
    kind = err["type"]
    ctx = err.get("ctx") or {}
    if kind == "missing":
        return f"{label} is required"
    if kind == "string_type":
        return f"{label} must be text"
    if kind in ("int_type", "int_parsing", "int_from_float"):
        return f"{label} must be a whole number"
    if kind == "string_too_short":
        return f"{label} must be at least {ctx.get('min_length')} character(s)"
    if kind == "string_too_long":
        return f"{label} must be at most {ctx.get('max_length')} characters"
    if kind == "greater_than_equal":
        return f"{label} must be at least {ctx.get('ge')}"
    if kind == "less_than_equal":
        return f"{label} must be at most {ctx.get('le')}"
    if kind == "too_short":
        return f"{label} must contain at least {ctx.get('min_length')} item(s)"
    if kind == "too_long":
        return f"{label} must contain at most {ctx.get('max_length')} items"
    if kind == "list_type":
        return f"{label} must be a list"
    if kind == "value_error":
        return str(err["msg"]).removeprefix("Value error, ")
    return f"{label} is invalid"


def parse_body(model):
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        raise ApiError("Request body must be a JSON object", 400, "invalid_json")
    try:
        return model.model_validate(data)
    except ValidationError as exc:
        fields = {}
        for err in exc.errors():
            name = ".".join(str(p) for p in err.get("loc", ())) or "request"
            fields.setdefault(name, _message(err))
        raise ApiError(next(iter(fields.values())), 422, "validation_error", fields=fields)
