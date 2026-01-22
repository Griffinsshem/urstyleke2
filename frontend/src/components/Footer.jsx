import Link from "next/link";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 px-6 pt-24 pb-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        {/* Brand */}
        <div>
          <h3 className="text-white text-sm tracking-[0.35em] uppercase mb-6">
            UrStyleKE
          </h3>
          <p className="text-sm leading-relaxed max-w-sm">
            Timeless fashion crafted for those who appreciate elegance,
            confidence, and refined modern luxury.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white text-xs tracking-[0.3em] uppercase mb-6">
            Explore
          </h4>
          <ul className="space-y-4 text-sm">
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
                Collections
              </Link>
            </li>
          </ul>
        </div>

        {/* Social / Contact */}
        <div>
          <h4 className="text-white text-xs tracking-[0.3em] uppercase mb-6">
            Connect
          </h4>
          <div className="flex items-center gap-6">
            <a href="#" aria-label="Instagram">
              <FaInstagram className="w-5 h-5 hover:text-white transition" />
            </a>
            <a href="#" aria-label="Twitter/X">
              <FaXTwitter className="w-5 h-5 hover:text-white transition" />
            </a>
            <a href="mailto:info@urstyleke.com" aria-label="Email">
              <HiOutlineMail className="w-6 h-6 hover:text-white transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto mt-20 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs tracking-wide">
        <span>
          © {new Date().getFullYear()} UrStyleKE. All rights reserved.
        </span>

        <div className="flex gap-6 mt-4 md:mt-0">
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
