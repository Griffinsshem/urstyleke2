from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.order import Order
from app.models.product import Product


orders_bp = Blueprint(
    "orders",
    __name__,
    url_prefix="/api/orders"
)


@orders_bp.route("", methods=["POST"])
@jwt_required()
def create_order():
    user_id = int(get_jwt_identity())

    data = request.get_json()

    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    if not product_id:
        return jsonify({"error": "product_id required"}), 400

    product = Product.query.get(product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    total_price = product.price * quantity

    order = Order(
        user_id=user_id,
        product_id=product.id,
        quantity=quantity,
        total_price=total_price,
        status="pending"
    )

    db.session.add(order)
    db.session.commit()

    return jsonify({
        "message": "Order created",
        "order_id": order.id
    }), 201