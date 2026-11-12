"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { getOrder } from "@/lib/orders";
import { clearCart } from "@/lib/cart";

export default function PaymentPage() {
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = localStorage.getItem("last_order_id");

    if (!orderId) {
      router.push("/checkout");
      return;
    }

    const loadOrder = async () => {
      try {
        const data = await getOrder(orderId);
        setOrder(data);
        // The order now exists on the server, so the cart is no longer needed.
        clearCart();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          Loading order...
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          Order not found
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white px-6 pt-32 pb-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-10">Order received</h1>

          <div className="border border-white/10 rounded-3xl p-6 mb-6">
            <p>Order #{order.id}</p>

            <p className="mt-3">Status: {order.status}</p>

            <p className="mt-3">
              Total: KES {order.total_price.toLocaleString()}
            </p>
          </div>

          <div className="border border-white/10 rounded-3xl p-6 mb-6">
            <h2 className="font-semibold mb-4">Items</h2>

            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2">
                <span>
                  {item.title} × {item.quantity}
                </span>

                <span>
                  KES {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="border border-yellow-500/20 bg-yellow-500/10 rounded-3xl p-6 mb-8">
            <h2 className="font-semibold text-yellow-400 mb-2">
              Online payment is not available yet
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Your order has been received and is being held as pending.
              Payment with M-Pesa is coming soon. You will not be charged
              until it is available.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/orders"
              className="flex-1 text-center bg-white text-black py-4 rounded-xl font-bold"
            >
              View my orders
            </Link>

            <Link
              href="/"
              className="flex-1 text-center border border-white/20 py-4 rounded-xl font-bold"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
