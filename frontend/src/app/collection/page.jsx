"use client";

import { useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PRODUCTS_PER_PAGE = 9;

// Temporary mock data (replace with backend later)
const products = [
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `men-${i}`,
    title: "Premium Menswear",
    category: "Men",
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `women-${i}`,
    title: "Premium Womenswear",
    category: "Women",
  })),
];

export default function CollectionPage() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(start, start + PRODUCTS_PER_PAGE);

  return (
    <section className="min-h-screen bg-black text-white px-6 pt-40 pb-32">
      {/* Header */}
      <Navbar />
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <span className="text-xs tracking-[0.35em] uppercase text-gray-400">
          Collection
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold mt-6 mb-6">
          Full Collection
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Discover our complete range of men’s and women’s luxury fashion,
          curated for timeless elegance.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-neutral-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition"
          >
            {/* Image Placeholder */}
            <div className="h-64 bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center relative">
              <FaShoppingBag className="w-10 h-10 text-gray-500 group-hover:scale-110 transition" />

              {/* Category Badge */}
              <span className="absolute top-4 left-4 text-[10px] tracking-[0.25em] uppercase bg-black/70 px-3 py-1 rounded-full border border-white/10">
                {product.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                {product.title}
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
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-6 mt-20">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-6 py-3 text-xs tracking-[0.25em] uppercase rounded-full border border-white/20 disabled:opacity-40 hover:bg-white hover:text-black transition"
        >
          Prev
        </button>

        <span className="text-xs tracking-widest text-gray-400">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-6 py-3 text-xs tracking-[0.25em] uppercase rounded-full border border-white/20 disabled:opacity-40 hover:bg-white hover:text-black transition"
        >
          Next
        </button>
      </div>
      <Footer />
    </section>
  );
}
