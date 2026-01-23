import { FaShoppingBag } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

export default function ProductCard({ title, category }) {
  return (
    <div className="group bg-neutral-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition">
      {/* Image */}
      <div className="h-64 bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center relative">
        <FaShoppingBag className="w-10 h-10 text-gray-500 group-hover:scale-110 transition" />

        {category && (
          <span className="absolute top-4 left-4 text-[10px] tracking-[0.25em] uppercase bg-black/70 px-3 py-1 rounded-full border border-white/10">
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">
          {title}
        </h3>

        <p className="text-sm text-gray-400 mb-6">
          Crafted with precision and refined modern luxury.
        </p>

        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 text-xs tracking-[0.25em] uppercase rounded-full border border-white/30 hover:bg-white hover:text-black transition">
          Book
          <FiArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
