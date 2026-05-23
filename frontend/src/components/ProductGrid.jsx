"use client";

import ProductCard from "@/components/ProductCard";

// Validate a single product object before rendering
function isValidProduct(p) {
  return (
    p &&
    typeof p.id       !== "undefined" &&
    typeof p.title    === "string"    &&
    typeof p.category === "string"    &&
    typeof p.price    === "number"    &&
    !isNaN(p.price)
  );
}

export default function ProductGrid({ products = [] }) {
  const valid = products.filter(isValidProduct);

  if (!valid.length) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="
          flex flex-col items-center justify-center
          py-28 text-center
        "
      >
        <div
          aria-hidden
          className="
            mb-6 flex items-center justify-center
            w-14 h-14 rounded-2xl
            border border-white/[0.08] bg-white/[0.03]
          "
        >
          <svg
            width="22" height="22" viewBox="0 0 24 24"
            fill="none" stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5" aria-hidden
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <p className="text-[0.8rem] font-semibold text-white/30 mb-1">
          No products available
        </p>
        <p className="text-[0.72rem] text-white/20">
          Check back soon for new arrivals.
        </p>
      </div>
    );
  }

  return (
    <ul
      role="list"
      aria-label="Product listing"
      className="
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        gap-5
      "
    >
      {valid.map((product) => (
        <li key={product.id}>
          <ProductCard
            id={product.id}
            title={product.title}
            category={product.category}
            price={product.price}
            image={product.image}
          />
        </li>
      ))}
    </ul>
  );
}
