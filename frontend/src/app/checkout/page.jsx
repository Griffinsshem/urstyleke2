"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { getCart } from "@/lib/cart";

export default function CheckoutPage() {
  const cart = getCart();

  return (
    <section className="bg-black text-white min-h-screen pt-32 px-6">
      <Navbar />
      <h1 className="text-4xl font-bold mb-12 text-center">
        Checkout
      </h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b border-white/10 pb-4"
            >
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">
                  Qty: {item.quantity}
                </p>
              </div>
              <span>
                KES {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </section>
  );
}
