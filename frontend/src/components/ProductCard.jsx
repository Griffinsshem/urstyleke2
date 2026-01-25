"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaShoppingBag } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { addToCart } from "@/lib/cart";

export default function ProductCard({
  id,
  title,
  category,
  price = 0,
  image,
}) {
  const router = useRouter();

  const handleAdd = () => {
    addToCart({ id, title, category, price, image });
    router.push("/checkout");
  };

  return (
    <div className="group bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition">

      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
      </div>

      {/* Content */}
      <div className="p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <FaShoppingBag className="text-gray-400 w-5 h-5" />
          <span className="text-xs tracking-widest uppercase text-gray-500">
            {category}
          </span>
        </div>

        <h3 className="text-lg font-semibold mb-2">
          {title}
        </h3>

        <p className="text-sm text-gray-400 mb-6">
          KES {Number(price).toLocaleString()}
        </p>

        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full
          border border-white/20
          hover:bg-white hover:text-black
          transition-all duration-300"
        >
          <FiPlus />
          Book
        </button>
      </div>
    </div>
  );
}
