"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaInstagram, FaXTwitter, FaCrown } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineExplore } from "react-icons/md";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 px-6 pt-28 pb-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-14">

        {/* Brand */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="relative border border-white/10 p-10 rounded-3xl"
        >
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
        </motion.div>

        {/* Navigation */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          className="border border-white/10 p-10 rounded-3xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <MdOutlineExplore className="text-white text-lg" />
            <h4 className="text-white text-xs tracking-[0.35em] uppercase">
              Explore
            </h4>
          </div>

          <ul className="space-y-5 text-sm">
            {[
              { label: "Men", href: "/men", icon: BsGenderMale },
              { label: "Women", href: "/women", icon: BsGenderFemale },
              { label: "Collections", href: "/collection", icon: MdOutlineExplore },
            ].map(({ label, href, icon: Icon }) => (
              <li key={label} className="flex items-center gap-4">
                <Icon className="opacity-70" />
                <Link
                  href={href}
                  className="relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Social / Contact */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
          className="border border-white/10 p-10 rounded-3xl"
        >
          <h4 className="text-white text-xs tracking-[0.35em] uppercase mb-8">
            Connect
          </h4>

          <div className="flex items-center gap-7">
            {[
              { icon: FaInstagram, label: "Instagram", href: "#" },
              { icon: FaXTwitter, label: "Twitter/X", href: "#" },
              { icon: HiOutlineMail, label: "Email", href: "mailto:info@urstyleke.com" },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="group relative"
              >
                <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-white" />
                <span className="absolute -bottom-2 left-1/2 h-px w-0 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={4}
        className="max-w-7xl mx-auto mt-24 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs tracking-wide"
      >
        <span className="opacity-80">
          © {new Date().getFullYear()} UrStyleKE. All rights reserved.
        </span>

        <div className="flex gap-8 mt-4 md:mt-0">
          {["Privacy", "Terms"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full hover:text-white"
            >
              {item}
            </Link>
          ))}
        </div>
      </motion.div>
    </footer>
  );
}
