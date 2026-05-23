"use client";

import { useEffect, useRef, useId } from "react";
import Link from "next/link";

const STATS = [
  { value: "12K+",  label: "Clients"     },
  { value: "340+",  label: "Pieces"      },
  { value: "6 Yrs", label: "In fashion"  },
];

const MARQUEE_ITEMS = [
  "Premium Fashion", "UrStyleKe", "Modern Luxury", "Kenyan Craft",
  "Timeless Quality", "Elevated Style", "Premium Fashion", "UrStyleKe",
  "Modern Luxury", "Kenyan Craft", "Timeless Quality", "Elevated Style",
];

export default function Hero() {
  const sectionRef = useRef(null);
  const headingId  = useId();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("hero--visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ── Entrance animation tokens ── */
        .hero-reveal {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1),
                      transform 0.75s cubic-bezier(0.16,1,0.3,1);
        }
        .hero--visible .hero-reveal { opacity: 1; transform: translateY(0); }

        .hero-reveal-d1 { transition-delay: 0.05s; }
        .hero-reveal-d2 { transition-delay: 0.18s; }
        .hero-reveal-d3 { transition-delay: 0.32s; }
        .hero-reveal-d4 { transition-delay: 0.46s; }
        .hero-reveal-d5 { transition-delay: 0.58s; }

        /* ── Grain overlay ── */
        .hero-grain::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          opacity: 0.035;
          pointer-events: none;
          z-index: 1;
        }

        /* ── Diagonal line grid ── */
        .hero-linegrid::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 1;
        }

        /* ── Radial glow pools ── */
        .hero-glow-a {
          position: absolute;
          width: 640px; height: 640px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
          top: -120px; left: -180px;
          pointer-events: none;
          z-index: 1;
        }
        .hero-glow-b {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
          bottom: -60px; right: -100px;
          pointer-events: none;
          z-index: 1;
        }

        /* ── Vertical rule lines ── */
        .hero-vline {
          position: absolute;
          top: 0; bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%);
          pointer-events: none;
          z-index: 1;
        }

        /* ── Marquee ── */
        .marquee-track {
          display: flex;
          gap: 0;
          animation: marquee 28s linear infinite;
          will-change: transform;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── Stat counter pulse ── */
        .stat-item {
          position: relative;
          transition: transform 0.2s ease;
        }
        .stat-item::after {
          content: "";
          position: absolute;
          inset: -12px -16px;
          border-radius: 16px;
          background: rgba(255,255,255,0);
          transition: background 0.2s ease;
        }
        .stat-item:hover { transform: translateY(-2px); }
        .stat-item:hover::after { background: rgba(255,255,255,0.03); }

        /* ── Button shimmer on hover ── */
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

        /* ── Scroll indicator ── */
        @keyframes scrollBob {
          0%, 100% { transform: translateY(0);   opacity: 0.4; }
          50%       { transform: translateY(6px); opacity: 0.9; }
        }
        .scroll-bob { animation: scrollBob 2s ease-in-out infinite; }

        /* ── Respect reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .hero-reveal,
          .hero-reveal.hero--visible { transition: none; opacity: 1; transform: none; }
          .marquee-track { animation: none; }
          .scroll-bob { animation: none; }
          .btn-primary::after { display: none; }
        }
      `}</style>

      {/* ── Section ──────────────────────────────────────────────────────── */}
      <section
        ref={sectionRef}
        role="region"
        aria-labelledby={headingId}
        className="
          hero-grain hero-linegrid
          relative min-h-screen bg-[#080808] text-white
          flex flex-col justify-center
          overflow-hidden
          pt-16
        "
      >
        {/* Decorative layers — all aria-hidden */}
        <div className="hero-glow-a" aria-hidden />
        <div className="hero-glow-b" aria-hidden />
        <div className="hero-vline" style={{ left: "8%" }}  aria-hidden />
        <div className="hero-vline" style={{ right: "8%" }} aria-hidden />

        {/* ── Main content ──────────────────────────────────────────────── */}
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 sm:px-10 py-24 sm:py-32">

          {/* Eyebrow */}
          <div className="hero-reveal hero-reveal-d1 flex items-center justify-center gap-3 mb-10">
            <div className="h-px w-8 bg-white/25" aria-hidden />
            <span className="text-[0.6rem] font-semibold tracking-[0.38em] uppercase text-white/40">
              Premium Fashion · Nairobi
            </span>
            <div className="h-px w-8 bg-white/25" aria-hidden />
          </div>

          {/* Heading */}
          <h1
            id={headingId}
            className="
              hero-reveal hero-reveal-d2
              text-center font-extrabold leading-[0.92] tracking-[-0.03em]
              text-[clamp(3rem,10vw,7.5rem)]
              text-white
            "
          >
            Redefine<br />
            <span
              className="
                inline-block
                bg-clip-text text-transparent
                "
              style={{
                WebkitBackgroundClip: "text",
                backgroundImage:
                  "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.55) 100%)",
              }}
            >
              Modern Luxury
            </span>
          </h1>

          {/* Sub-copy */}
          <p
            className="
              hero-reveal hero-reveal-d3
              mt-8 max-w-xl mx-auto text-center text-white/45
              text-[0.95rem] leading-[1.75] text-white/45
              tracking-wide
            "
          >
            Timeless pieces crafted for individuals who value elegance,
            confidence, and uncompromising quality — made in Kenya, worn worldwide.
          </p>

          {/* CTAs */}
          <div className="hero-reveal hero-reveal-d4 mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/collection"
              className="
                btn-primary
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
            </Link>

            <Link
              href="/about"
              className="
                px-9 py-3.5 rounded-xl
                border border-white/[0.12] text-white/60
                text-xs font-bold tracking-[0.14em] uppercase
                hover:border-white/30 hover:text-white hover:bg-white/[0.04]
                active:scale-[0.98]
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-white/30 focus-visible:ring-offset-2
                focus-visible:ring-offset-[#080808]
              "
            >
              Our Story
            </Link>
          </div>

          {/* Stats */}
          <div
            className="
              hero-reveal hero-reveal-d5
              mt-20 flex items-center justify-center gap-0
              border-t border-white/[0.06] pt-10
            "
          >
            {STATS.map(({ value, label }, i) => (
              <div key={label} className="flex items-stretch">
                <div className="stat-item flex flex-col items-center px-10 sm:px-14">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    {value}
                  </span>
                  <span className="mt-1 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-white/35">
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

        {/* ── Marquee strip ─────────────────────────────────────────────── */}
        <div
          aria-hidden
          className="
            relative z-10 w-full overflow-hidden
            border-t border-b border-white/[0.05]
            py-3.5
          "
        >
          {/* Left / right fade masks */}
          <div
            className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #080808, transparent)" }}
          />
          <div
            className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, #080808, transparent)" }}
          />

          <div className="marquee-track" aria-hidden>
            {MARQUEE_ITEMS.map((item, i) => (
              <span
                key={i}
                className="
                  whitespace-nowrap
                  text-[0.6rem] font-semibold tracking-[0.28em] uppercase
                  text-white/20 px-8
                "
              >
                {item}
                <span className="ml-8 text-white/10">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Scroll indicator ──────────────────────────────────────────── */}
        <div
          aria-hidden
          className="
            relative z-10
            flex flex-col items-center gap-2
            py-8 text-white/25
          "
        >
          <span className="text-[0.55rem] font-semibold tracking-[0.28em] uppercase">
            Scroll
          </span>
          <svg
            className="scroll-bob"
            width="14" height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
      </section>
    </>
  );
}
