"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({
  id,
  title,
  category,
  price,
  image,
}) {
  return (
    <Link
      href={`/products/${id}`}
      className="group block bg-neutral-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-neutral-800">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition duration-500"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        <p className="text-xs uppercase tracking-widest text-gray-400">
          {category}
        </p>

        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="text-xl font-bold text-white">
          KES {price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
