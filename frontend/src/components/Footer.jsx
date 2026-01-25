import Link from "next/link";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 px-6 pt-28 pb-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">

        {/* Brand */}
        <div className="space-y-6">
          <h3 className="text-white text-sm tracking-[0.4em] uppercase">
            UrStyleKE
          </h3>
          <p className="text-sm leading-relaxed max-w-sm">
            Timeless fashion crafted for those who appreciate elegance,
            confidence, and refined modern luxury.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-6">
          <h4 className="text-white text-xs tracking-[0.35em] uppercase">
            Explore
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/men" className="hover:text-white transition">
                Men
              </Link>
            </li>
            <li>
              <Link href="/women" className="hover:text-white transition">
                Women
              </Link>
            </li>
            <li>
              <Link href="/collection" className="hover:text-white transition">
                Collection
              </Link>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div className="space-y-6">
          <h4 className="text-white text-xs tracking-[0.35em] uppercase">
            Connect
          </h4>
          <div className="flex items-center gap-8">
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-white transition"
            >
              <FaInstagram className="w-5 h-5" />
            </a>

            <a
              href="#"
              aria-label="Twitter/X"
              className="hover:text-white transition"
            >
              <FaXTwitter className="w-5 h-5" />
            </a>

            <a
              href="mailto:info@urstyleke.com"
              aria-label="Email"
              className="hover:text-white transition"
            >
              <HiOutlineMail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10
        flex flex-col md:flex-row items-center justify-between gap-6
        text-xs tracking-wide">

        <span>
          © {new Date().getFullYear()} UrStyleKE. All rights reserved.
        </span>

        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-white transition">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white transition">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
