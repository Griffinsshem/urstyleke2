"use client";

import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getCartCount } from "@/lib/cart";

export default function Navbar() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCartCount());

    const handleStorage = () => {
      setCount(getCartCount());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cart-updated", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cart-updated", handleStorage);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between text-white">
        {/* Brand */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.25em] uppercase flex items-center gap-2"
        >
          <FaShoppingBag className="w-5 h-5" />
          UrStyleKE
        </Link>

        {/* Navigation */}
        <ul className="hidden md:flex items-center gap-10 text-xs tracking-[0.3em] uppercase text-gray-300">
          <li><Link href="/men" className="hover:text-white">Men</Link></li>
          <li><Link href="/women" className="hover:text-white">Women</Link></li>
          <li><Link href="/collection" className="hover:text-white">Collection</Link></li>
        </ul>

        {/* Cart + Sign in */}
        <div className="flex items-center gap-6">
          {/* Cart */}
          <Link href="/checkout" className="relative">
            <FaShoppingBag className="w-5 h-5 hover:text-white transition" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </Link>

          {/* Sign In */}
          <Link
            href="/signin"
            className="text-xs tracking-[0.25em] uppercase border border-white/40 px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
          >
            Sign In
          </Link>
        </div>
      </nav>
    </header>
  );
}
