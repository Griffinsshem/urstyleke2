"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCart } from "@/lib/cart";
import { FaShoppingBag } from "react-icons/fa";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());

    const updateCart = () => {
      setCart(getCart());
    };

    window.addEventListener("cart-updated", updateCart);
    window.addEventListener("storage", updateCart);

    return () => {
      window.removeEventListener("cart-updated", updateCart);
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="bg-black text-white min-h-screen pt-32 px-6">
      <Navbar />

      <h1 className="text-4xl font-bold mb-12 text-center">
        Checkout
      </h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-400">
          Your cart is empty.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Cart Items */}
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-neutral-900 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-4">
                <FaShoppingBag className="text-gray-400 w-5 h-5" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-400">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>

              <span className="font-medium">
                KES {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-between items-center border-t border-white/10 pt-6 text-lg font-semibold">
            <span>Total</span>
            <span>KES {total.toLocaleString()}</span>
          </div>

          {/* CTA */}
          <button className="w-full mt-6 py-4 rounded-full bg-white text-black font-semibold hover:scale-[1.02] transition">
            Proceed to Payment
          </button>
        </div>
      )}

      <Footer />
    </section>
  );
}
