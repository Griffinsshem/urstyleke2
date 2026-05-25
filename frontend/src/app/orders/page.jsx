"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { getOrders } from "@/lib/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          <h1 className="text-5xl font-bold mb-10">
            My Orders
          </h1>

          {loading && (
            <p className="text-white/60">
              Loading orders...
            </p>
          )}

          {!loading && orders.length === 0 && (
            <div className="border border-white/10 rounded-3xl p-10 text-center">
              <h2 className="text-2xl font-semibold mb-3">
                No orders yet
              </h2>

              <p className="text-white/60 mb-6">
                Start shopping to see your orders here.
              </p>

              <Link
                href="/collection"
                className="inline-block bg-white text-black px-6 py-3 rounded-xl font-semibold"
              >
                Browse Collection
              </Link>
            </div>
          )}

          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-white/10 rounded-3xl p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>
                    <h2 className="text-xl font-bold">
                      Order #{order.id}
                    </h2>

                    <p className="text-white/50 text-sm mt-1">
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        order.status === "paid"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>

                    <span className="font-bold">
                      KES {order.total_price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between py-2"
                    >
                      <span>
                        {item.title} × {item.quantity}
                      </span>

                      <span>
                        KES{" "}
                        {(
                          item.price * item.quantity
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}