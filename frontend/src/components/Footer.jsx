"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiInstagram, FiTwitter, FiMail, FiArrowUpRight } from "react-icons/fi";

const CURRENT_YEAR = new Date().getFullYear();

const NAV_LINKS = [
  { label: "Men",         href: "/men"        },
  { label: "Women",       href: "/women"      },
  { label: "Collections", href: "/collection" },
  { label: "About",       href: "/about"      },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href:  "https://instagram.com/urstyleke",
    Icon:  FiInstagram,
    external: true,
  },
  {
    label: "X / Twitter",
    href:  "https://x.com/urstyleke",
    Icon:  FiTwitter,
    external: true,
  },
  {
    label: "Email us",
    href:  "mailto:info@urstyleke.com",
    Icon:  FiMail,
    external: false,
  },
];

const LEGAL_LINKS = [
  { label: "Privacy",      href: "/privacy"      },
  { label: "Terms",        href: "/terms"         },
  { label: "Shipping",     href: "/shipping"      },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay:    i * 0.13,
      duration: 0.7,
      ease:     [0.16, 1, 0.3, 1],
    },
  }),
};

export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="
        relative bg-[#080808] text-white
        overflow-hidden
        border-t border-white/[0.06]
      "
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Radial glow — top-left ────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle,rgba(255,255,255,0.03) 0%,transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">

        {/* ── Top grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-20 pb-12">

          {/* ── Brand panel ────────────────────────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={0}
            className="
              rounded-3xl border border-white/[0.07]
              bg-white/[0.02]
              p-8 flex flex-col justify-between
              min-h-[220px]
            "
          >
            <div>
              {/* Wordmark */}
              <div className="flex items-center gap-2.5 mb-5">
                {/* Geometric crown mark — pure CSS, no external icon */}
                <span
                  aria-hidden
                  className="
                    flex items-center justify-center
                    w-7 h-7 rounded-lg border border-white/20
                    text-[10px] font-black tracking-tighter text-white/60
                  "
                >
                  UK
                </span>
                <span className="text-[0.62rem] font-bold tracking-[0.32em] uppercase text-white/80">
                  UrStyleKe
                </span>
              </div>

              <p className="text-[0.8rem] leading-[1.75] text-white/38 max-w-[260px]">
                Timeless fashion crafted for individuals who value elegance,
                confidence, and understated modern luxury.
              </p>
            </div>

            {/* Nairobi tag */}
            <div className="mt-8 flex items-center gap-2" aria-hidden>
              <div className="h-px w-5 bg-white/15" />
              <span className="text-[0.55rem] font-semibold tracking-[0.25em] uppercase text-white/25">
                Nairobi, Kenya
              </span>
            </div>
          </motion.div>

          {/* ── Explore panel ──────────────────────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={1}
            className="
              rounded-3xl border border-white/[0.07]
              bg-white/[0.02]
              p-8
            "
          >
            <p className="text-[0.6rem] font-semibold tracking-[0.28em] uppercase text-white/28 mb-7">
              Explore
            </p>

            <ul className="flex flex-col gap-1" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="
                      group flex items-center justify-between
                      px-3 py-2.5 rounded-xl
                      text-[0.82rem] font-medium text-white/45
                      hover:text-white hover:bg-white/[0.05]
                      transition-all duration-150
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-white/30
                    "
                  >
                    {label}
                    <FiArrowUpRight
                      aria-hidden
                      size={13}
                      className="opacity-0 group-hover:opacity-40 transition-opacity duration-150 -rotate-0 group-hover:rotate-0"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Connect panel ──────────────────────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={2}
            className="
              rounded-3xl border border-white/[0.07]
              bg-white/[0.02]
              p-8 flex flex-col justify-between
            "
          >
            <div>
              <p className="text-[0.6rem] font-semibold tracking-[0.28em] uppercase text-white/28 mb-7">
                Connect
              </p>

              <div className="flex flex-col gap-2">
                {SOCIAL_LINKS.map(({ label, href, Icon, external }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    {...(external
                      ? {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                    className="
                      group flex items-center gap-3
                      px-3 py-2.5 rounded-xl
                      text-white/40
                      hover:text-white hover:bg-white/[0.05]
                      transition-all duration-150
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-white/30
                    "
                  >
                    <Icon
                      aria-hidden
                      size={15}
                      className="shrink-0 transition-transform duration-150 group-hover:scale-110"
                    />
                    <span className="text-[0.8rem] font-medium">{label}</span>
                    {external && (
                      <FiArrowUpRight
                        aria-hidden
                        size={12}
                        className="ml-auto opacity-0 group-hover:opacity-35 transition-opacity duration-150"
                      />
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter micro-CTA */}
            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <p className="text-[0.7rem] text-white/28 mb-3 tracking-wide">
                Stay in the loop
              </p>
              <Link
                href="/newsletter"
                className="
                  inline-flex items-center gap-2
                  px-4 py-2.5 rounded-xl
                  border border-white/[0.1] text-white/50
                  text-[0.7rem] font-semibold tracking-[0.1em] uppercase
                  hover:border-white/25 hover:text-white hover:bg-white/[0.04]
                  transition-all duration-150
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-white/30
                "
              >
                <FiMail aria-hidden size={13} />
                Subscribe
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          custom={3}
          className="
            border-t border-white/[0.06] py-7
            flex flex-col sm:flex-row items-center justify-between
            gap-4
          "
        >
          {/* Copyright */}
          <span className="text-[0.65rem] text-white/22 tracking-wide select-none">
            © {CURRENT_YEAR} UrStyleKe. All rights reserved.
          </span>

          {/* Legal links */}
          <nav aria-label="Legal links">
            <ul className="flex items-center gap-1" role="list">
              {LEGAL_LINKS.map(({ label, href }, i) => (
                <li key={label} className="flex items-center">
                  <Link
                    href={href}
                    className="
                      px-3 py-1.5 rounded-lg
                      text-[0.65rem] font-medium text-white/28
                      hover:text-white/70 hover:bg-white/[0.04]
                      transition-all duration-150
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-white/30
                    "
                  >
                    {label}
                  </Link>
                  {i < LEGAL_LINKS.length - 1 && (
                    <span aria-hidden className="text-white/12 text-[0.5rem]">
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Security footnote */}
          <span className="text-[0.6rem] text-white/18 tracking-wide select-none hidden sm:block">
            Protected by industry-standard encryption
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
