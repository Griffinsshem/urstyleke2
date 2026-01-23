"use client";

import { FaShoppingBag } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { addToCart } from "@/lib/cart";

export default function ProductCard({ id, title, category, price = 0 }) {
  const handleAdd = () => {
    addToCart({ id, title, category, price });
  };

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 text-white hover:border-white/30 transition">
      <div className="flex items-center justify-between mb-4">
        <FaShoppingBag className="text-gray-400 w-5 h-5" />
        <span className="text-xs tracking-widest uppercase text-gray-500">
          {category}
        </span>
      </div>

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="text-sm text-gray-400 mt-2 mb-6">
        KES {Number(price).toLocaleString()}
      </p>

      <button
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition"
      >
        <FiPlus />
        Book
      </button>
    </div>
  );
}
