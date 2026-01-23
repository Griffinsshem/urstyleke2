"use client";

import { useSearchParams } from "next/navigation";
import { FaShoppingBag, FaCreditCard } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const searchParams = useSearchParams();

  const title = searchParams.get("title");
  const category = searchParams.get("category");

  return (
    <section className="min-h-screen bg-black text-white px-6 pt-40 pb-32">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-xs tracking-[0.35em] uppercase text-gray-400">
            Checkout
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold mt-6">
            Review Your Selection
          </h1>
        </div>

        {/* Product Card */}
        <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-10 flex flex-col md:flex-row gap-10 items-center">
          {/* Image */}
          <div className="w-full md:w-1/2 h-64 bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center rounded-xl">
            <FaShoppingBag className="w-12 h-12 text-gray-500" />
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2">
            <span className="text-xs tracking-[0.25em] uppercase text-gray-400">
              {category}
            </span>

            <h2 className="text-2xl font-bold mt-4 mb-4">
              {title}
            </h2>

            <p className="text-gray-400 mb-8">
              A premium piece crafted for timeless elegance and modern luxury.
            </p>

            <button className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition">
              <FaCreditCard className="w-4 h-4" />
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
