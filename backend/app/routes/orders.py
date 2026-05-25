from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.order import Order
from app.models.product import Product
from app.models.order_item import OrderItem


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

    items = data.get("items", [])

    if not items:
        return jsonify({"error": "Cart is empty"}), 400

    total_price = 0

    order = Order(
        user_id=user_id,
        total_price=0,
        status="pending"
    )

    db.session.add(order)
    db.session.flush()

    for item in items:
        product_id = item.get("id")
        try:
            quantity = int(item.get("quantity", 1))
        except (TypeError, ValueError):
            quantity = 1

        if quantity < 1:
            quantity = 1

        product = Product.query.get(product_id)

        if not product:
            db.session.rollback()
            return jsonify({
                "error": f"Product {product_id} not found"
            }), 404

        line_total = product.price * quantity
        total_price += line_total

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            title=product.title,
            price=product.price,
            quantity=quantity
        )

        db.session.add(order_item)

    order.total_price = total_price

    db.session.commit()

    return jsonify({
        "message": "Order created successfully",
        "order_id": order.id,
        "total_price": total_price
    }), 201


@orders_bp.route("", methods=["GET"])
@jwt_required()
def get_orders():
    user_id = int(get_jwt_identity())

    orders = (
        Order.query
        .filter_by(user_id=user_id)
        .order_by(Order.created_at.desc())
        .all()
    )

    result = []

    for order in orders:
        result.append({
            "id": order.id,
            "total_price": order.total_price,
            "status": order.status,
            "created_at": order.created_at.isoformat(),
            "items": [
                {
                    "id": item.id,
                    "product_id": item.product_id,
                    "title": item.title,
                    "price": item.price,
                    "quantity": item.quantity
                }
                for item in order.items
            ]
        })

    return jsonify(result), 200


@orders_bp.route("/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):
    user_id = int(get_jwt_identity())

    order = Order.query.filter_by(
        id=order_id,
        user_id=user_id
    ).first()

    if not order:
        return jsonify({
            "error": "Order not found"
        }), 404

    return jsonify({
        "id": order.id,
        "total_price": order.total_price,
        "status": order.status,
        "created_at": order.created_at.isoformat(),
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "title": item.title,
                "price": item.price,
                "quantity": item.quantity
            }
            for item in order.items
        ]
    }), 200


@orders_bp.route("/<int:order_id>/pay", methods=["PATCH"])
@jwt_required()
def pay_order(order_id):
    user_id = int(get_jwt_identity())

    order = Order.query.filter_by(
        id=order_id,
        user_id=user_id
    ).first()

    if not order:
        return jsonify({
            "error": "Order not found"
        }), 404

    if order.status == "paid":
        return jsonify({
            "error": "Order already paid"
        }), 400

    order.status = "paid"

    db.session.commit()

    return jsonify({
        "message": "Payment successful",
        "order_id": order.id,
        "status": order.status
    }), 200