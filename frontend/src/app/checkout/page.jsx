"use client";

import { useEffect, useState } from "react";
import {
  getCart,
  updateQuantity,
  removeFromCart,
} from "@/lib/cart";
import { FaTrash, FaCreditCard } from "react-icons/fa";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const changeQty = (id, qty) => {
    if (qty < 1) return;
    updateQuantity(id, qty);
    setCart(getCart());
  };

  const removeItem = id => {
    removeFromCart(id);
    setCart(getCart());
  };

  return (
    <section className="min-h-screen bg-black text-white px-6 pt-40 pb-32">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">
          Checkout
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-400">
            Your cart is empty.
          </p>
        ) : (
          <>
            {/* Items */}
            <div className="space-y-6">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-neutral-900/60 border border-white/10 rounded-xl p-6"
                >
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                      {item.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        changeQty(item.id, item.quantity - 1)
                      }
                      className="px-3 py-1 border border-white/20 rounded"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        changeQty(item.id, item.quantity + 1)
                      }
                      className="px-3 py-1 border border-white/20 rounded"
                    >
                      +
                    </button>
                  </div>

                  <p className="w-24 text-right">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-12 flex justify-between items-center border-t border-white/10 pt-8">
              <span className="text-lg">Total</span>
              <span className="text-2xl font-bold">
                KES {total.toLocaleString()}
              </span>
            </div>

            {/* Pay */}
            <button className="mt-10 w-full flex items-center justify-center gap-3 py-4 bg-white text-black rounded-full font-semibold hover:scale-105 transition">
              <FaCreditCard />
              Proceed to Payment
            </button>
          </>
        )}
      </div>
    </section>
  );
}
