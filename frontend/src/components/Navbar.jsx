"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isAuthenticated, signOut } from "@/lib/auth";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // initial check
    setLoggedIn(isAuthenticated());

    const syncAuth = () => {
      setLoggedIn(isAuthenticated());
    };

    window.addEventListener("auth-changed", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("auth-changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10 px-6 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white font-extrabold tracking-widest">
          URSTYLEKE
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8 text-sm tracking-widest uppercase">
          <Link href="/men" className="hover:text-white transition">
            Men
          </Link>
          <Link href="/women" className="hover:text-white transition">
            Women
          </Link>
          <Link href="/collection" className="hover:text-white transition">
            Collection
          </Link>

          {/* Auth */}
          {!loggedIn ? (
            <>
              <Link
                href="/signin"
                className="border border-white/20 px-5 py-2 rounded-full hover:bg-white hover:text-black transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-white text-black px-5 py-2 rounded-full hover:scale-105 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-white/20 px-5 py-2 rounded-full hover:bg-white hover:text-black transition"
            >
              <FaSignOutAlt />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
