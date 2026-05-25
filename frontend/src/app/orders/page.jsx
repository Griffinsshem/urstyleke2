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

      <main className="min-h-screen bg-[#070707] text-white pt-32 pb-24 px-6 relative overflow-hidden">

        {/* glow background */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/5 blur-[140px] rounded-full" />

        <div className="max-w-5xl mx-auto relative z-10 animate-fadeIn">

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              My Orders
            </h1>
            <p className="text-white/40 mt-3 text-sm">
              Track your purchases and order history
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center text-white/60 animate-pulse">
              Loading your orders...
            </div>
          )}

          {/* Empty state */}
          {!loading && orders.length === 0 && (
            <div className="border border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-3xl p-12 text-center animate-fadeIn">
              <h2 className="text-2xl font-semibold mb-3">
                No orders yet
              </h2>

              <p className="text-white/50 mb-6">
                Discover premium fashion and place your first order.
              </p>

              <Link
                href="/collection"
                className="
                  inline-block bg-white text-black
                  px-6 py-3 rounded-xl font-semibold
                  hover:scale-105 active:scale-95
                  transition
                "
              >
                Browse Collection
              </Link>
            </div>
          )}

          {/* Orders */}
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="
                  border border-white/10
                  bg-white/[0.03] backdrop-blur-xl
                  rounded-3xl p-6
                  transition hover:border-white/20 hover:bg-white/[0.05]
                  animate-slideUp
                "
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* top row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>
                    <h2 className="text-xl font-bold">
                      Order #{order.id}
                    </h2>

                    <p className="text-white/40 text-sm mt-1">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">

                    {/* status */}
                    <span
                      className={`
                        px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider
                        ${
                          order.status === "paid"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        }
                      `}
                    >
                      {order.status}
                    </span>

                    {/* price */}
                    <span className="font-bold text-white/90">
                      KES {order.total_price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* items */}
                <div className="mt-6 border-t border-white/10 pt-4 space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-white/70 text-sm"
                    >
                      <span>
                        {item.title} × {item.quantity}
                      </span>

                      <span className="text-white/50">
                        KES {(item.price * item.quantity).toLocaleString()}
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

      {/* <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out both;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style> */}
    </>
  );
}