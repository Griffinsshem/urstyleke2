"use client";

import { FaShoppingBag } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { addToCart } from "@/lib/cart";

export default function ProductCard({ id, title, category, price }) {
  const handleAdd = () => {
    addToCart({ id, title, category, price });
    window.location.href = "/checkout";
  };

  return (
    <div className="group bg-neutral-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition">
      {/* Image */}
      <div className="h-64 bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center">
        <FaShoppingBag className="w-10 h-10 text-gray-500" />
      </div>

      {/* Content */}
      <div className="p-6">
        <span className="text-xs tracking-[0.25em] uppercase text-gray-400">
          {category}
        </span>

        <h3 className="text-lg font-semibold mt-3">{title}</h3>

        <p className="text-sm text-gray-400 mt-2 mb-6">
          KES {price.toLocaleString()}
        </p>

        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 text-xs tracking-[0.25em] uppercase rounded-full border border-white/30 hover:bg-white hover:text-black transition"
        >
          Book
          <FiPlus />
        </button>
      </div>
    </div>
  );
}
