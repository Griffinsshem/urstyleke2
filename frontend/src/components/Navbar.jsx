"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { isAuthenticated, getUser, signOut } from "@/lib/auth";

import {
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    syncAuth();

    const listener = () => syncAuth();

    window.addEventListener("auth-changed", listener);
    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("auth-changed", listener);
      window.removeEventListener("storage", listener);
    };
  }, []);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const syncAuth = () => {
    const auth = isAuthenticated();

    setLoggedIn(auth);

    if (auth) {
      setUser(getUser());
    } else {
      setUser(null);
    }
  };

  const handleLogout = () => {
    signOut();

    setDropdownOpen(false);
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
            Sign In
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
        /* USER DROPDOWN */
        <div
          ref={dropdownRef}
          className="relative"
        >
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="
              flex items-center gap-2
              border border-white/20
              px-4 py-2 rounded-full
              hover:bg-white hover:text-black
              transition
            "
          >
            <FaUserCircle />

            <span className="text-sm max-w-[120px] truncate">
              {user?.email}
            </span>

            <FaChevronDown className="text-xs" />
          </button>

          {dropdownOpen && (
            <div
              className="
                absolute right-0 mt-3
                w-44
                bg-gray-900
                border border-gray-800
                rounded-xl shadow-xl
                overflow-hidden
                z-50
              "
            >
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="
                  block px-4 py-3 text-sm
                  hover:bg-gray-800 transition
                "
              >
                Profile
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setDropdownOpen(false)}
                className="
                  block px-4 py-3 text-sm
                  hover:bg-gray-800 transition
                "
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="
                  w-full text-left
                  px-4 py-3 text-sm
                  flex items-center gap-2
                  text-red-400
                  hover:bg-gray-800 transition
                "
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10 px-6 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link
          href="/"
          className="text-white font-extrabold tracking-widest"
        >
          URSTYLEKE
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase">
          <NavLinks />
        </div>

        {/* Mobile Button */}
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
