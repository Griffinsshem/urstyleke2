"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MenPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();

      // Filter men + limit to 6
      const menProducts = data
        .filter((item) => item.category === "men")
        .slice(0, 6);

      setProducts(menProducts);
    }

    loadProducts();
  }, []);

  return (
    <section className="min-h-screen bg-black text-white px-6 pt-40 pb-32">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <span className="text-xs tracking-[0.35em] uppercase text-gray-400">
          Men
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold mt-6 mb-6">
          Men’s Collection
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Explore premium men’s fashion.
        </p>
      </div>

      {/* Products */}
      <ProductGrid products={products} />

      <Footer />
    </section>
  );
}
