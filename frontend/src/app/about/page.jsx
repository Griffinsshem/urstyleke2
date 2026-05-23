"use client";

import { useEffect, useRef, useId } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FiAward, FiHeart, FiZap, FiArrowRight,
} from "react-icons/fi";

const STATS = [
  { value: "12K+",  label: "Clients worldwide" },
  { value: "340+",  label: "Pieces crafted"     },
  { value: "6 Yrs", label: "In fashion"          },
  { value: "100%",  label: "Made in Kenya"       },
];

const VALUES = [
  {
    Icon:    FiAward,
    title:   "Craftsmanship",
    body:    "Every piece passes through hands trained for years in Nairobi's finest ateliers. Quality is not a feature — it is the foundation.",
  },
  {
    Icon:    FiHeart,
    title:   "Confidence",
    body:    "We design for the individual who carries their identity with ease. Fashion should feel like armour, not costume.",
  },
  {
    Icon:    FiZap,
    title:   "Modernity",
    body:    "Heritage silhouettes reinterpreted through a contemporary Kenyan lens. Timeless form, living detail.",
  },
];

const TEAM = [
  { initials: "AW", name: "Amina Wanjiru",  role: "Creative Director"    },
  { initials: "KO", name: "Kofi Osei",      role: "Head of Design"        },
  { initials: "FM", name: "Fatuma Muthoni", role: "Brand & Communications" },
];

function useReveal(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("section--vis");
          obs.disconnect();
        }
      },
      { threshold: 0.07 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const heroRef   = useRef(null);
  const valRef    = useRef(null);
  const teamRef   = useRef(null);
  const ctaRef    = useRef(null);
  const headingId = useId();

  useReveal(heroRef);
  useReveal(valRef);
  useReveal(teamRef);
  useReveal(ctaRef);

  return (
    <>
      {/* ── Scoped styles ─────────────────────────────────────────────────── */}
      <style>{`
        /* Reveal tokens */
        .reveal {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.72s cubic-bezier(0.16,1,0.3,1),
                      transform 0.72s cubic-bezier(0.16,1,0.3,1);
        }
        .section--vis .reveal { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.06s; }
        .d2 { transition-delay: 0.18s; }
        .d3 { transition-delay: 0.30s; }
        .d4 { transition-delay: 0.42s; }
        .d5 { transition-delay: 0.54s; }

        /* Grain */
        .page-grain::before {
          content: "";
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          opacity: 0.033;
          pointer-events: none;
          z-index: 0;
        }

        /* Grid lines */
        .page-grid::after {
          content: "";
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* Value card hover */
        .value-card {
          transition: border-color 0.2s ease, background 0.2s ease,
                      transform 0.2s ease;
        }
        .value-card:hover {
          border-color: rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.035);
          transform: translateY(-2px);
        }

        /* Team card hover */
        .team-card {
          transition: border-color 0.2s ease, background 0.2s ease,
                      transform 0.2s ease;
        }
        .team-card:hover {
          border-color: rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.035);
          transform: translateY(-2px);
        }

        /* Stat hover */
        .stat-item {
          transition: transform 0.2s ease;
        }
        .stat-item:hover { transform: translateY(-2px); }

        /* Button shimmer */
        .btn-primary {
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: "";
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent);
          transition: left 0.4s ease;
        }
        .btn-primary:hover::after { left: 140%; }
        .btn-primary:hover .btn-arrow { transform: translateX(2px); }
        .btn-arrow { transition: transform 0.2s ease; }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .reveal, .section--vis .reveal { transition: none; opacity: 1; transform: none; }
          .value-card:hover, .team-card:hover, .stat-item:hover { transform: none; }
          .btn-primary::after { display: none; }
        }
      `}</style>

      <div className="page-grain page-grid relative min-h-screen bg-[#080808] text-white">

        <Navbar />

        {/* ── HERO SECTION ────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          role="region"
          aria-labelledby={headingId}
          className="relative z-10 pt-36 pb-24 px-6 sm:px-10"
        >
          {/* Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse,rgba(255,255,255,0.04) 0%,transparent 70%)",
            }}
          />

          <div className="relative max-w-4xl mx-auto text-center">

            {/* Eyebrow */}
            <div className="reveal d1 flex items-center justify-center gap-3 mb-9">
              <div className="h-px w-8 bg-white/22" aria-hidden />
              <span className="text-[0.6rem] font-semibold tracking-[0.38em] uppercase text-white/38">
                Our Story
              </span>
              <div className="h-px w-8 bg-white/22" aria-hidden />
            </div>

            {/* Heading */}
            <h1
              id={headingId}
              className="
                reveal d2
                font-extrabold leading-[0.92] tracking-[-0.03em]
                text-[clamp(2.6rem,8vw,5.5rem)] text-white mb-8
              "
            >
              Dressed in{" "}
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage:
                    "linear-gradient(135deg,#ffffff 0%,rgba(255,255,255,0.48) 100%)",
                  backgroundClip: "text",
                }}
              >
                Nairobi
              </span>
              ,<br className="hidden sm:block" /> worn everywhere.
            </h1>

            {/* Lead copy */}
            <p className="reveal d3 max-w-2xl mx-auto text-[0.95rem] leading-[1.78] text-white/42 tracking-wide">
              UrStyleKe is a premium fashion brand dedicated to timeless
              elegance, refined craftsmanship, and modern luxury. Every piece
              is designed to empower confidence and celebrate the individuality
              of the wearer — rooted in Kenyan culture, built for the world.
            </p>

            {/* Stats strip */}
            <div className="reveal d4 mt-16 flex flex-wrap items-center justify-center gap-0 border-t border-white/[0.06] pt-12">
              {STATS.map(({ value, label }, i) => (
                <div key={label} className="flex items-stretch">
                  <div className="stat-item flex flex-col items-center px-8 sm:px-12 cursor-default">
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                      {value}
                    </span>
                    <span className="mt-1 text-[0.58rem] font-semibold tracking-[0.2em] uppercase text-white/32">
                      {label}
                    </span>
                  </div>
                  {i < STATS.length - 1 && (
                    <div
                      aria-hidden
                      className="w-px self-stretch bg-white/[0.07] my-1"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Horizontal rule */}
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="h-px bg-white/[0.06]" aria-hidden />
        </div>

        {/* ── VALUES SECTION ───────────────────────────────────────────────── */}
        <section
          ref={valRef}
          aria-labelledby="values-heading"
          className="relative z-10 py-24 px-6 sm:px-10"
        >
          <div className="max-w-6xl mx-auto">

            <div className="mb-14 text-center">
              <span className="reveal d1 inline-block text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-white/30 mb-4">
                What we stand for
              </span>
              <h2
                id="values-heading"
                className="reveal d2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white"
              >
                The pillars of UrStyleKe
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {VALUES.map(({ Icon, title, body }, i) => (
                <div
                  key={title}
                  className={`
                    reveal value-card
                    rounded-3xl border border-white/[0.07]
                    bg-white/[0.02] p-8
                    d${i + 3}
                  `}
                >
                  <div
                    className="
                      mb-6 flex items-center justify-center
                      w-10 h-10 rounded-xl border border-white/[0.1]
                      bg-white/[0.04]
                    "
                    aria-hidden
                  >
                    <Icon size={17} className="text-white/55" />
                  </div>
                  <h3 className="text-sm font-bold tracking-wide text-white mb-3">
                    {title}
                  </h3>
                  <p className="text-[0.8rem] leading-[1.75] text-white/40">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Horizontal rule */}
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="h-px bg-white/[0.06]" aria-hidden />
        </div>

        {/* ── TEAM SECTION ─────────────────────────────────────────────────── */}
        <section
          ref={teamRef}
          aria-labelledby="team-heading"
          className="relative z-10 py-24 px-6 sm:px-10"
        >
          <div className="max-w-6xl mx-auto">

            <div className="mb-14 text-center">
              <span className="reveal d1 inline-block text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-white/30 mb-4">
                The people behind it
              </span>
              <h2
                id="team-heading"
                className="reveal d2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white"
              >
                Meet the team
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TEAM.map(({ initials, name, role }, i) => (
                <div
                  key={name}
                  className={`
                    reveal team-card
                    rounded-3xl border border-white/[0.07]
                    bg-white/[0.02]
                    p-8 flex flex-col items-center text-center
                    d${i + 3}
                  `}
                >
                  {/* Avatar — CSS-only, no image request */}
                  <div
                    aria-hidden
                    className="
                      mb-5 flex items-center justify-center
                      w-16 h-16 rounded-2xl
                      border border-white/[0.1] bg-white/[0.06]
                      text-base font-bold tracking-wide text-white/60
                    "
                  >
                    {initials}
                  </div>
                  <p className="text-sm font-bold text-white mb-1">{name}</p>
                  <p className="text-[0.72rem] text-white/38 tracking-wide">
                    {role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Horizontal rule */}
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="h-px bg-white/[0.06]" aria-hidden />
        </div>

        {/* ── CTA SECTION ──────────────────────────────────────────────────── */}
        <section
          ref={ctaRef}
          aria-label="Call to action"
          className="relative z-10 py-28 px-6 sm:px-10"
        >
          {/* Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              className="w-[600px] h-[300px] rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse,rgba(255,255,255,0.035) 0%,transparent 70%)",
              }}
            />
          </div>

          <div className="relative max-w-2xl mx-auto text-center">
            <div className="reveal d1 flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-8 bg-white/22" aria-hidden />
              <span className="text-[0.6rem] font-semibold tracking-[0.38em] uppercase text-white/38">
                Ready to explore
              </span>
              <div className="h-px w-8 bg-white/22" aria-hidden />
            </div>

            <h2
              className="
                reveal d2
                text-[clamp(1.8rem,5vw,3.4rem)] font-extrabold
                tracking-tight leading-[1.08] text-white mb-6
              "
            >
              Wear your story.<br />Start with ours.
            </h2>

            <p className="reveal d3 text-[0.9rem] leading-[1.75] text-white/40 mb-10">
              Browse our latest collections and discover pieces that speak to
              who you are and who you're becoming.
            </p>

            <div className="reveal d4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/collection"
                className="
                  btn-primary
                  inline-flex items-center gap-2
                  px-9 py-3.5 rounded-xl
                  bg-white text-black
                  text-xs font-bold tracking-[0.14em] uppercase
                  hover:bg-white/90 active:scale-[0.98]
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-white/60 focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#080808]
                "
              >
                Shop Collection
                <FiArrowRight
                  size={14}
                  className="btn-arrow"
                  aria-hidden
                />
              </Link>

              <Link
                href="/register"
                className="
                  inline-flex items-center
                  px-9 py-3.5 rounded-xl
                  border border-white/[0.12] text-white/58
                  text-xs font-bold tracking-[0.14em] uppercase
                  hover:border-white/30 hover:text-white hover:bg-white/[0.04]
                  active:scale-[0.98]
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-white/30 focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#080808]
                "
              >
                Join UrStyleKe
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
