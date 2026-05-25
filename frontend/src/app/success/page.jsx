"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">
        Payment Successful
      </h1>

      <p className="text-white/60 mb-8">
        Thank you for your purchase.
      </p>

      <div className="flex gap-4">
        <Link
          href="/orders"
          className="bg-white text-black px-6 py-3 rounded-xl"
        >
          View Orders
        </Link>

        <Link
          href="/collection"
          className="border border-white/20 rounded-xl px-6 py-3"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}