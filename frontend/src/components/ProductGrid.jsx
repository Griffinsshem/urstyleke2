"use client";

import ProductCard from "./ProductCard";

export default function ProductGrid({ products, showCategory = false }) {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          title={product.title}
          category={showCategory ? product.category : null}
        />
      ))}
    </div>
  );
}
