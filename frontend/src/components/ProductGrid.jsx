"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export default function ProductGrid({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  /* Filter by category */
  const filteredProducts = category
    ? products.filter(
      (p) =>
        p.category &&
        p.category.toLowerCase() === category.toLowerCase()
    )
    : products;

  /* Loading */
  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading products...
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );
  }

  /* Empty */
  if (!filteredProducts.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        No products available
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          category={product.category}
          price={product.price}
          image={product.image}
        />
      ))}
    </div>
  );
}
