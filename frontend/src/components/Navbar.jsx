"use client";

import Link from "next/link";
import { useState } from "react";
import { FiLogIn, FiLogOut, FiUserPlus } from "react-icons/fi";

export default function Navbar() {

  const [isRegistered, setIsRegistered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-white text-sm tracking-[0.35em] uppercase"
        >
          UrStyleKE
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex gap-10 text-sm text-gray-400">
          <Link href="/men" className="hover:text-white transition">
            Men
          </Link>
          <Link href="/women" className="hover:text-white transition">
            Women
          </Link>
          <Link href="/collection" className="hover:text-white transition">
            Collection
          </Link>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4 text-sm">

          {/* Register */}
          {!isRegistered && (
            <button
              onClick={() => setIsRegistered(true)}
              className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition"
            >
              <FiUserPlus />
              Register
            </button>
          )}

          {/* Sign In */}
          {isRegistered && !isAuthenticated && (
            <button
              onClick={() => setIsAuthenticated(true)}
              className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition"
            >
              <FiLogIn />
              Sign In
            </button>
          )}

          {/* Logout */}
          {isAuthenticated && (
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-2 px-4 py-2 border border-red-500/40 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition"
            >
              <FiLogOut />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
