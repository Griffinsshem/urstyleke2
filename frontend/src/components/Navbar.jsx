"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaShoppingBag, FaSignOutAlt } from "react-icons/fa";
import { getCartCount } from "@/lib/cart";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const syncAuth = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    const syncCart = () => setCartCount(getCartCount());

    syncAuth();
    syncCart();

    window.addEventListener("storage", syncAuth);
    window.addEventListener("cart-updated", syncCart);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("cart-updated", syncCart);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between text-white">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-[0.25em] uppercase"
        >
          <FaShoppingBag className="w-5 h-5" />
          UrStyleKE
        </Link>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-10 text-xs tracking-[0.3em] uppercase text-gray-300">
          <li><Link href="/men" className="hover:text-white">Men</Link></li>
          <li><Link href="/women" className="hover:text-white">Women</Link></li>
          <li><Link href="/collection" className="hover:text-white">Collection</Link></li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {/* Cart */}
          <Link href="/checkout" className="relative">
            <FaShoppingBag className="w-5 h-5 hover:text-white transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] px-2 py-[2px] rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {!user ? (
            <>
              <Link
                href="/register"
                className="text-xs tracking-[0.25em] uppercase hover:text-white"
              >
                Register
              </Link>
              <Link
                href="/signin"
                className="text-xs tracking-[0.25em] uppercase border border-white/30 px-5 py-2 rounded-full
                hover:bg-white hover:text-black transition"
              >
                Sign In
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase
              border border-white/30 px-5 py-2 rounded-full hover:bg-white hover:text-black transition"
            >
              <FaSignOutAlt />
              Sign Out
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
