"use client";

import { useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CollectionPage() {
  // Pagination state (for future backend pagination)
  const [page, setPage] = useState(1);

  return (
    <section className="min-h-screen bg-black text-white px-6 pt-40 pb-32">
      <Navbar />

      {/* Header */}
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

      {/* Products (Now fetched from API) */}
      <ProductGrid />

      {/* Pagination (UI only for now) */}
      <div className="flex justify-center items-center gap-8 mt-24">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-8 py-3 text-xs tracking-[0.25em] uppercase rounded-full
          border border-white/20 disabled:opacity-40
          hover:bg-white hover:text-black transition"
        >
          Prev
        </button>

        <span className="text-xs tracking-widest text-gray-400">
          Page {page}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-8 py-3 text-xs tracking-[0.25em] uppercase rounded-full
          border border-white/20
          hover:bg-white hover:text-black transition"
        >
          Next
        </button>
      </div>

      <Footer />
    </section>
  );
}
