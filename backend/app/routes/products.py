from flask import Blueprint, jsonify

from ..extensions import db
from ..models.product import Product
from ..schemas import ProductCreateRequest, ProductUpdateRequest
from ..utils.auth import admin_required
from ..validation import parse_body


products_bp = Blueprint(
    "products",
    __name__,
    url_prefix="/api/products"
)

PLACEHOLDER_IMAGE = "/images/placeholder.jpg"


# Helper: serialize product
def serialize_product(p):
    return {
        "id": p.id,
        "title": p.title,
        "price": p.price,
        "image": p.image,
        "category": p.category,
        "created_at": p.created_at.isoformat() if p.created_at else None
    }


# Get all products (Public)
@products_bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([serialize_product(p) for p in products]), 200


# Get single product
@products_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):

    product = Product.query.get_or_404(product_id)

    return jsonify(serialize_product(product)), 200


# Create product (Admin only)
@products_bp.route("", methods=["POST"])
@products_bp.route("/", methods=["POST"])
@admin_required
def create_product():
    body = parse_body(ProductCreateRequest)

    product = Product(
        title=body.title,
        price=body.price,
        category=body.category,
        image=body.image or PLACEHOLDER_IMAGE,
    )

    db.session.add(product)
    db.session.commit()

    return jsonify(serialize_product(product)), 201


# Update product (Admin only)
@products_bp.route("/<int:product_id>", methods=["PUT"])
@admin_required
def update_product(product_id):

    product = Product.query.get_or_404(product_id)

    body = parse_body(ProductUpdateRequest)

    # Only the four schema fields can ever be set; explicit nulls mean "leave unchanged".
    for field, value in body.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(product, field, value)

    db.session.commit()

    return jsonify(serialize_product(product)), 200


# Delete product (Admin only)
@products_bp.route("/<int:product_id>", methods=["DELETE"])
@admin_required
def delete_product(product_id):

    product = Product.query.get_or_404(product_id)

    db.session.delete(product)
    db.session.commit()

    return {"message": "Product deleted"}, 200
