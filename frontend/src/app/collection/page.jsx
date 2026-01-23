"use client";

import { useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PRODUCTS_PER_PAGE = 9;

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
      <Navbar />
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <span className="text-xs tracking-[0.35em] uppercase text-gray-400">
          Collection
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold mt-6 mb-6">
          Full Collection
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Discover men’s and women’s luxury fashion in one curated space.
        </p>
      </div>

      <ProductGrid products={currentProducts} showCategory />

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
