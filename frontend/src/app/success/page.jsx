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

      <Link
        href="/collection"
        className="bg-white text-black px-6 py-3 rounded-xl"
      >
        Continue Shopping
      </Link>
    </main>
  );
}