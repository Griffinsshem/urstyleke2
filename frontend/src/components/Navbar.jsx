import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";

export default function Navbar() {
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

        {/* Navigation */}
        <ul className="hidden md:flex items-center gap-10 text-xs tracking-[0.3em] uppercase text-gray-300">
          <li className="hover:text-white transition cursor-pointer">
            Men
          </li>
          <li className="hover:text-white transition cursor-pointer">
            Women
          </li>
          <li className="hover:text-white transition cursor-pointer">
            Collection
          </li>
        </ul>

        {/* Action */}
        <button className="text-xs tracking-[0.25em] uppercase border border-white/40 px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
          Sign In
        </button>
      </nav>
    </header>
  );
}
