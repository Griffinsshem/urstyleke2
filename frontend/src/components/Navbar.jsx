"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-white text-sm tracking-[0.35em] uppercase"
        >
          UrStyleKE
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10 text-sm">
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
        <div className="flex items-center gap-4">
          {/* Login */}
          {pathname !== "/login" && (
            <Link
              href="/login"
              className="text-sm text-gray-300 hover:text-white transition"
            >
              Sign In
            </Link>
          )}

          {/* Register */}
          {pathname !== "/register" && (
            <Link
              href="/register"
              className="px-5 py-2 rounded-full border border-white/20 text-sm
              hover:bg-white hover:text-black transition"
            >
              Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
