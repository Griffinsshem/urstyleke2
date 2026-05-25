# 👔 UrStyleKE

**Premium Fashion E-Commerce Platform Inspired by Kenyan Culture**

UrStyleKE is a full-stack fashion e-commerce platform built to deliver a modern luxury shopping experience. The platform showcases premium fashion collections, enables secure user authentication, supports shopping cart and checkout workflows, and provides complete order management functionality.

Designed with a focus on performance, clean architecture, and responsive user experience, UrStyleKE demonstrates full-stack development skills using modern frontend and backend technologies.

---

## 🌍 Project Vision

UrStyleKE is a premium fashion brand dedicated to timeless elegance, refined craftsmanship, and modern luxury.

Every piece is designed to empower confidence and celebrate the individuality of the wearer — rooted in Kenyan culture, built for the world.

---

## ✨ Features

### Authentication & Security

- ✅ User Registration
- ✅ User Login
- ✅ JWT Authentication
- ✅ Protected Routes
- ✅ User Profile Management
- ✅ Secure Password Hashing

### Shopping Experience

- ✅ Browse Product Catalog
- ✅ Product Detail Pages
- ✅ Category-Based Collections
- ✅ Responsive Product Grid
- ✅ Modern Fashion UI

### Cart & Checkout

- ✅ Add to Cart
- ✅ Remove from Cart
- ✅ Cart Quantity Management
- ✅ Dynamic Cart Counter
- ✅ Checkout Workflow

### Order Management

- ✅ Create Orders
- ✅ View Order History
- ✅ View Order Details
- ✅ Payment Simulation
- ✅ Order Status Tracking

### User Experience

- ✅ Fully Responsive Design
- ✅ Mobile Navigation Menu
- ✅ Protected Dashboard
- ✅ Profile Management
- ✅ Smooth Navigation

---

## 🛠️ Tech Stack

### Frontend

- Next.js 16
- React 19
- Tailwind CSS 4
- Framer Motion
- React Icons

### Backend

- Flask
- Flask SQLAlchemy
- Flask JWT Extended
- Flask Migrate
- Flask CORS

### Database

- mySQL
- SQLAlchemy ORM
- Alembic Migrations

### Authentication

- JWT Tokens
- Werkzeug Password Hashing

---

## 🏗️ System Architecture

### Frontend Structure

```text
src/
├── app/
│   ├── about/
│   ├── checkout/
│   ├── collection/
│   ├── dashboard/
│   ├── login/
│   ├── men/
│   ├── orders/
│   ├── payment/
│   ├── privacy/
│   ├── products/
│   ├── profile/
│   ├── register/
│   ├── success/
│   ├── terms/
│   └── women/
│
├── components/
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   └── ProtectedRoute.jsx
│
├── context/
│   └── AuthContext.jsx
│
└── lib/
    ├── auth.js
    ├── cart.js
    ├── orders.js
    └── products.js
```

### Backend Structure

```text
backend/app/
├── models/
│   ├── user.py
│   ├── product.py
│   ├── order.py
│   └── order_item.py
│
├── routes/
│   ├── auth.py
│   ├── products.py
│   └── orders.py
│
├── config.py
├── extensions.py
└── __init__.py
```

---

## 🗄️ Database Schema

### Users

| Field | Type |
|---------|---------|
| id | Integer |
| email | String |
| password | String |

### Products

| Field | Type |
|---------|---------|
| id | Integer |
| title | String |
| category | String |
| price | Integer |
| image | String |
| created_at | DateTime |

### Orders

| Field | Type |
|---------|---------|
| id | Integer |
| user_id | Integer |
| total_price | Float |
| status | String |
| created_at | DateTime |

### Order Items

| Field | Type |
|---------|---------|
| id | Integer |
| order_id | Integer |
| product_id | Integer |
| title | String |
| price | Float |
| quantity | Integer |

### Relationships

```text
User
 └── Orders
      └── OrderItems
            └── Products
```

---

## 🔐 Authentication Flow

1. User registers an account.
2. User logs in using email and password.
3. Backend generates a JWT access token.
4. Token is stored on the client.
5. Protected endpoints verify the token.
6. Authenticated users can manage orders and profile data.

---

## 📡 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/profile
```

### Products

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders

```http
POST  /api/orders
GET   /api/orders
GET   /api/orders/:id
PATCH /api/orders/:id/pay
```

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/Griffinsshem/urstyleke2
cd urstyleke
```

---

### Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run database migrations:

```bash
flask db upgrade
```

Start backend server:

```bash
flask run
```

Backend runs on:

```text
http://127.0.0.1:5000
```

---

### Frontend Setup

```bash
cd frontend

npm install
```

Create environment file:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

## 🧪 Core User Flow

### Shopping Flow

1. Browse products
2. View product details
3. Add products to cart
4. Proceed to checkout
5. Create order
6. Simulate payment
7. Order status updated to paid
8. View order history

---

## 🔮 Future Improvements

### Planned Features

- M-Pesa Integration
- Admin Dashboard
- Product Search
- Wishlist Functionality
- Product Reviews
- Inventory Management
- Email Notifications
- Order Tracking
- Analytics Dashboard

---

## 🎯 Learning Outcomes

This project was built independently to strengthen practical full-stack development skills and gain hands-on experience with:

- Next.js App Router
- React State Management
- JWT Authentication
- REST API Development
- PostgreSQL Database Design
- SQLAlchemy ORM
- Order Processing Workflows
- Responsive UI Development
- Production Deployment

---

## 👨‍💻 Author

### Griffins Shem Ondeyo

Full-Stack Developer

Responsibilities:

- Designed and developed the full application independently
- Built the Next.js frontend
- Developed the Flask REST API
- Designed the PostgreSQL database schema
- Implemented JWT authentication
- Built shopping cart functionality
- Implemented checkout and payment workflow
- Developed order management system
- Designed responsive user interfaces

---

## 📈 Project Status

Current Version: **MVP Complete**

Implemented:

- User Authentication
- Product Catalog
- Product Details
- Shopping Cart
- Checkout
- Payment Simulation
- Order Management
- Dashboard
- Responsive Design

Upcoming:

- M-Pesa Integration
- Admin Dashboard
- Product Search
- Wishlist

---

## 📄 License

This project is intended for educational, portfolio, and learning purposes.