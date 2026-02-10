import Link from "next/link";
import { FaInstagram, FaXTwitter, FaCrown } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineExplore } from "react-icons/md";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 px-6 pt-28 pb-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-14">

        {/* Brand */}
        <div className="relative border border-white/10 p-10 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <FaCrown className="text-white text-xl" />
            <h3 className="text-white text-xs tracking-[0.4em] uppercase">
              UrStyleKE
            </h3>
          </div>

          <p className="text-sm leading-relaxed max-w-sm">
            Timeless fashion crafted for individuals who value elegance,
            confidence, and understated modern luxury.
          </p>

          <span className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        </div>

        {/* Navigation */}
        <div className="border border-white/10 p-10 rounded-3xl">
          <div className="flex items-center gap-3 mb-8">
            <MdOutlineExplore className="text-white text-lg" />
            <h4 className="text-white text-xs tracking-[0.35em] uppercase">
              Explore
            </h4>
          </div>

          <ul className="space-y-5 text-sm">
            <li className="flex items-center gap-4">
              <BsGenderMale className="opacity-70" />
              <Link
                href="/men"
                className="hover:text-white transition-colors"
              >
                Men
              </Link>
            </li>
            <li className="flex items-center gap-4">
              <BsGenderFemale className="opacity-70" />
              <Link
                href="/women"
                className="hover:text-white transition-colors"
              >
                Women
              </Link>
            </li>
            <li className="flex items-center gap-4">
              <MdOutlineExplore className="opacity-70" />
              <Link
                href="/collection"
                className="hover:text-white transition-colors"
              >
                Collections
              </Link>
            </li>
          </ul>
        </div>

        {/* Social / Contact */}
        <div className="border border-white/10 p-10 rounded-3xl">
          <h4 className="text-white text-xs tracking-[0.35em] uppercase mb-8">
            Connect
          </h4>

          <div className="flex items-center gap-7">
            <a
              href="#"
              aria-label="Instagram"
              className="group"
            >
              <FaInstagram className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:text-white" />
            </a>

            <a
              href="#"
              aria-label="Twitter/X"
              className="group"
            >
              <FaXTwitter className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:text-white" />
            </a>

            <a
              href="mailto:info@urstyleke.com"
              aria-label="Email"
              className="group"
            >
              <HiOutlineMail className="w-6 h-6 transition-transform group-hover:scale-110 group-hover:text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-24 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs tracking-wide">
        <span className="opacity-80">
          © {new Date().getFullYear()} UrStyleKE. All rights reserved.
        </span>

        <div className="flex gap-8 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
