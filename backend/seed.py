from app import create_app
from app.extensions import db
from app.models.product import Product

app = create_app()

with app.app_context():

    db.session.query(Product).delete()

    products = [
        Product(
            title="Classic Cap",
            category="men",
            price=1500,
            image="/images/men/cap.jpg",
        ),
        Product(
            title="Premium Hoodie",
            category="men",
            price=4500,
            image="/images/men/hoodie.jpg",
        ),
        Product(
            title="Denim Jacket",
            category="men",
            price=6500,
            image="/images/men/jacket.jpg",
        ),
        Product(
            title="Slim Fit Jeans",
            category="men",
            price=3800,
            image="/images/men/jeans.jpg",
        ),
        Product(
            title="Oxford Shirt",
            category="men",
            price=2800,
            image="/images/men/shirt.jpg",
        ),
        Product(
            title="White Sneakers",
            category="men",
            price=5200,
            image="/images/men/sneakers.jpg",
        ),
        Product(
            title="Luxury Handbag",
            category="women",
            price=7000,
            image="/images/women/bag.jpg",
        ),
        Product(
            title="Silk Blouse",
            category="women",
            price=3200,
            image="/images/women/blouse.jpg",
        ),
        Product(
            title="Evening Dress",
            category="women",
            price=8500,
            image="/images/women/dress.jpg",
        ),
        Product(
            title="Elegant Heels",
            category="women",
            price=5500,
            image="/images/women/heels.jpg",
        ),
        Product(
            title="Women's Jacket",
            category="women",
            price=6200,
            image="/images/women/jacket.jpg",
        ),
        Product(
            title="Pleated Skirt",
            category="women",
            price=2900,
            image="/images/women/skirt.jpg",
        ),
    ]

    db.session.bulk_save_objects(products)
    db.session.commit()

    print(f"Seeded {len(products)} products")