"use client";

import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products = [] }) {
  /* Empty */
  if (!products.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        No products available
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      {products.map((product) => (
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
