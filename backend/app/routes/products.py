from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models.product import Product


products_bp = Blueprint(
    "products",
    __name__,
    url_prefix="/api/products"
)


# -------------------------
# Get all products (Public)
# -------------------------
@products_bp.route("/", methods=["GET"])
def get_products():

    products = Product.query.all()

    result = []

    for p in products:
        result.append({
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "price": p.price,
            "image": p.image,
            "category": p.category,
            "created_at": p.created_at.isoformat() if p.created_at else None
        })

    return jsonify(result), 200


# -------------------------
# Get single product
# -------------------------
@products_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):

    product = Product.query.get_or_404(product_id)

    return jsonify({
        "id": product.id,
        "title": product.title,
        "description": product.description,
        "price": product.price,
        "image": product.image,
        "category": product.category,
        "created_at": product.created_at.isoformat() if product.created_at else None
    }), 200


# -------------------------
# Create product (Protected)
# -------------------------
@products_bp.route("/", methods=["POST"])
@jwt_required()
def create_product():

    data = request.get_json()

    title = data.get("title")
    price = data.get("price")

    if not title or not price:
        return {"error": "Title and price required"}, 400

    product = Product(
        title=title,
        description=data.get("description"),
        price=price,
        image=data.get("image"),
        category=data.get("category")
    )

    db.session.add(product)
    db.session.commit()

    return {"message": "Product created"}, 201


# -------------------------
# Update product
# -------------------------
@products_bp.route("/<int:product_id>", methods=["PUT"])
@jwt_required()
def update_product(product_id):

    product = Product.query.get_or_404(product_id)

    data = request.get_json()

    product.title = data.get("title", product.title)
    product.description = data.get("description", product.description)
    product.price = data.get("price", product.price)
    product.image = data.get("image", product.image)
    product.category = data.get("category", product.category)

    db.session.commit()

    return {"message": "Product updated"}, 200


# -------------------------
# Delete product
# -------------------------
@products_bp.route("/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):

    product = Product.query.get_or_404(product_id)

    db.session.delete(product)
    db.session.commit()

    return {"message": "Product deleted"}, 200
