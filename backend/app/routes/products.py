from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models.product import Product


products_bp = Blueprint(
    "products",
    __name__,
    url_prefix="/api/products"
)


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
@products_bp.route("", methods=["GET"])
@products_bp.route("/", methods=["GET"])
def get_products():

    products = Product.query.all()

    result = [serialize_product(p) for p in products]

    return jsonify(result), 200


# Get single product
@products_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):

    product = Product.query.get_or_404(product_id)

    return jsonify(serialize_product(product)), 200


# Create product (Protected)
@products_bp.route("", methods=["POST"])
@products_bp.route("/", methods=["POST"])
@jwt_required()
def create_product():

    data = request.get_json()

    title = data.get("title")
    price = data.get("price")
    category = data.get("category")
    image = data.get("image") or "/images/placeholder.jpg"

    if not title or not price:
        return {"error": "Title and price are required"}, 400

    product = Product(
        title=title,
        price=price,
        category=category,
        image=image
    )

    db.session.add(product)
    db.session.commit()

    return jsonify(serialize_product(product)), 201


# Update product
@products_bp.route("/<int:product_id>", methods=["PUT"])
@jwt_required()
def update_product(product_id):

    product = Product.query.get_or_404(product_id)

    data = request.get_json()

    product.title = data.get("title", product.title)
    product.price = data.get("price", product.price)
    product.image = data.get("image", product.image)
    product.category = data.get("category", product.category)

    db.session.commit()

    return jsonify(serialize_product(product)), 200


# Delete product
@products_bp.route("/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):

    product = Product.query.get_or_404(product_id)

    db.session.delete(product)
    db.session.commit()

    return {"message": "Product deleted"}, 200
