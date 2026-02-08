"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WomenPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();

      // Filter women + limit to 6
      const womenProducts = data
        .filter((item) => item.category === "women")
        .slice(0, 6);

      setProducts(womenProducts);
    }

    loadProducts();
  }, []);

  return (
    <section className="min-h-screen bg-black text-white px-6 pt-40 pb-32">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <span className="text-xs tracking-[0.35em] uppercase text-gray-400">
          Women
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold mt-6 mb-6">
          Women’s Collection
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Discover elegant women’s fashion.
        </p>
      </div>

      {/* Products */}
      <ProductGrid products={products} />

      <Footer />
    </section>
  );
}
