import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-white">
        <Link href="/" className="text-xl font-bold tracking-wide">
          UrStyleKE
        </Link>

        <ul className="hidden md:flex gap-8 text-sm uppercase tracking-wider">
          <li className="hover:text-gray-300 transition">Men</li>
          <li className="hover:text-gray-300 transition">Women</li>
          <li className="hover:text-gray-300 transition">Collections</li>
        </ul>

        <button className="px-5 py-2 border border-white rounded-full text-sm hover:bg-white hover:text-black transition">
          Sign In
        </button>
      </nav>
    </header>
  );
}
