"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { getOrder, payOrder } from "@/lib/orders";
import { clearCart } from "@/lib/cart";

export default function PaymentPage() {
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const orderId = localStorage.getItem(
      "last_order_id"
    );

    if (!orderId) {
      router.push("/checkout");
      return;
    }

    const loadOrder = async () => {
      try {
        const data = await getOrder(orderId);
        setOrder(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [router]);

  const handlePay = async () => {
    try {
      setPaying(true);

      const orderId =
        localStorage.getItem("last_order_id");

      if(!orderId) {
        throw new Error("Order not found");
      }

      await payOrder(orderId);

      clearCart();

      localStorage.removeItem("last_order_id");

      router.push("/success");
    } catch (error) {
      console.error(error);
      alert(error.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

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

          <h1 className="text-4xl font-bold mb-10">
            Payment
          </h1>

          <div className="border border-white/10 rounded-3xl p-6 mb-6">
            <p>Order #{order.id}</p>

            <p className="mt-3">
              Status: {order.status}
            </p>

            <p className="mt-3">
              Total: KES {order.total_price.toLocaleString()}
            </p>
          </div>

          <div className="border border-white/10 rounded-3xl p-6 mb-8">
            <h2 className="font-semibold mb-4">
              Items
            </h2>

            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-2"
              >
                <span>
                  {item.title} × {item.quantity}
                </span>

                <span>
                  KES {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full bg-white text-black py-4 rounded-xl font-bold"
          >
            {paying
              ? "Processing..."
              : "Pay Now"}
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}