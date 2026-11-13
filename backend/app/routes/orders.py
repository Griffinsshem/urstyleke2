from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.errors import error_response
from app.extensions import db
from app.models.order import Order
from app.models.product import Product
from app.models.order_item import OrderItem
from app.schemas import OrderCreateRequest
from app.validation import parse_body


orders_bp = Blueprint(
    "orders",
    __name__,
    url_prefix="/api/orders"
)


@orders_bp.route("", methods=["POST"])
@jwt_required()
def create_order():
    user_id = int(get_jwt_identity())

    body = parse_body(OrderCreateRequest)

    total_price = 0

    order = Order(
        user_id=user_id,
        total_price=0,
        status="pending"
    )

    db.session.add(order)
    db.session.flush()

    for item in body.items:
        product = db.session.get(Product, item.id)

        if not product:
            db.session.rollback()
            return error_response(f"Product {item.id} not found", 404, "product_not_found")

        line_total = product.price * item.quantity
        total_price += line_total

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            title=product.title,
            price=product.price,
            quantity=item.quantity
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
        return error_response("Order not found", 404, "order_not_found")

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
