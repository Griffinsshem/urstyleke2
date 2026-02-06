from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models.product import Product


products_bp = Blueprint(
    "products",
    __name__,
    url_prefix="/api/products"
)


# ============================
# GET ALL PRODUCTS (PUBLIC)
# ============================
@products_bp.route("/", methods=["GET"])
def get_products():

    category = request.args.get("category")

    query = Product.query

    # Filter by category (Men / Women)
    if category:
        query = query.filter_by(category=category)

    products = query.all()

    return jsonify([
        {
            "id": p.id,
            "title": p.title,
            "category": p.category,
            "price": p.price,
            "image": p.image,
            "created_at": p.created_at.isoformat()
        }
        for p in products
    ]), 200


# ============================
# GET SINGLE PRODUCT
# ============================
@products_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):

    product = Product.query.get_or_404(product_id)

    return jsonify({
        "id": product.id,
        "title": product.title,
        "category": product.category,
        "price": product.price,
        "image": product.image,
        "created_at": product.created_at.isoformat()
    }), 200


# ============================
# CREATE PRODUCT (ADMIN)
# ============================
@products_bp.route("/", methods=["POST"])
@jwt_required()
def create_product():

    data = request.get_json()

    title = data.get("title")
    category = data.get("category")
    price = data.get("price")
    image = data.get("image")

    if not title or not category or not price or not image:
        return jsonify({
            "error": "Title, category, price and image are required"
        }), 400

    product = Product(
        title=title,
        category=category,
        price=price,
        image=image
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({
        "message": "Product created successfully"
    }), 201


# ============================
# UPDATE PRODUCT
# ============================
@products_bp.route("/<int:product_id>", methods=["PUT"])
@jwt_required()
def update_product(product_id):

    product = Product.query.get_or_404(product_id)

    data = request.get_json()

    product.title = data.get("title", product.title)
    product.category = data.get("category", product.category)
    product.price = data.get("price", product.price)
    product.image = data.get("image", product.image)

    db.session.commit()

    return jsonify({
        "message": "Product updated successfully"
    }), 200


# ============================
# DELETE PRODUCT
# ============================
@products_bp.route("/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):

    product = Product.query.get_or_404(product_id)

    db.session.delete(product)
    db.session.commit()

    return jsonify({
        "message": "Product deleted successfully"
    }), 200
