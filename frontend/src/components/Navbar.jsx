"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaShoppingBag, FaSignOutAlt } from "react-icons/fa";
import { getUser, signOut } from "@/lib/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());

    const sync = () => setUser(getUser());
    window.addEventListener("auth-changed", sync);

    return () => window.removeEventListener("auth-changed", sync);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between text-white">

        {/* Brand */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.25em] uppercase"
        >
          <FaShoppingBag className="inline-block w-6 h-6 mr-2 mb-1" />
          UrStyleKE
        </Link>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-10 text-xs tracking-[0.3em] uppercase text-gray-300">
          <Link href="/men" className="hover:text-white">Men</Link>
          <Link href="/women" className="hover:text-white">Women</Link>
          <Link href="/collection" className="hover:text-white">Collection</Link>
        </ul>

        {/* Auth */}
        {user ? (
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase
            border border-white/40 px-6 py-3 rounded-full
            hover:bg-white hover:text-black transition"
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        ) : (
          <Link
            href="/signin"
            className="text-xs tracking-[0.25em] uppercase
            border border-white/40 px-6 py-3 rounded-full
            hover:bg-white hover:text-black transition"
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}
