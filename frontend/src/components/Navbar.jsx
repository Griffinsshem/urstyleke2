"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isAuthenticated, signOut } from "@/lib/auth";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
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
    setMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      <Link href="/men" onClick={() => setMenuOpen(false)}>
        Men
      </Link>
      <Link href="/women" onClick={() => setMenuOpen(false)}>
        Women
      </Link>
      <Link href="/collection" onClick={() => setMenuOpen(false)}>
        Collection
      </Link>

      {!loggedIn ? (
        <>
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="border border-white/20 px-5 py-2 rounded-full hover:bg-white hover:text-black transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
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
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10 px-6 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white font-extrabold tracking-widest">
          URSTYLEKE
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase">
          <NavLinks />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-xl"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-6 px-6">
          <div className="flex flex-col gap-6 text-sm tracking-widest uppercase">
            <NavLinks />
          </div>
        </div>
      )}
    </nav>
  );
}
