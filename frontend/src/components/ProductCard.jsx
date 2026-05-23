"use client";

/**
 * ProductCard — UrStyleKe
 *
 * Engineering & security hardening:
 * 1.  href is always `/products/${id}` — a static template with a server-
 *     controlled id. Never constructed from user-supplied free text.
 * 2.  price is validated as a finite number before .toLocaleString() —
 *     prevents "NaN" or "Infinity" rendering and potential prototype attacks.
 * 3.  title is sanitised via safeText() before use in alt and heading —
 *     strips <, >, " characters to prevent attribute injection in alt text.
 * 4.  image src falls back to /images/placeholder.jpg when falsy — no
 *     broken-image states. The placeholder path is a static literal.
 * 5.  Image has explicit sizes prop — prevents oversized network requests.
 * 6.  No dangerouslySetInnerHTML anywhere.
 * 7.  Focus-visible ring consistent with the rest of the design system.
 * 8.  aria-label on the card Link — screen readers get title + price without
 *     needing to traverse the card contents.
 * 9.  category display is truncated to 32 chars max — prevents layout break
 *     from unexpectedly long category strings from the API.
 * 10. Image scale on hover is CSS-only, respects prefers-reduced-motion.
 */

import Image from "next/image";
import Link from "next/link";

// ── Helpers ────────────────────────────────────────────────────────────────────
/** Strip characters that could break HTML attributes. */
const safeText = (str, max = 120) => {
  if (typeof str !== "string") return "";
  return str.replace(/[<>"']/g, "").trim().slice(0, max);
};

/** Format price safely — always a finite KES amount. */
const formatPrice = (price) => {
  if (typeof price !== "number" || !isFinite(price) || price < 0) return "—";
  return `KES ${Math.round(price).toLocaleString("en-KE")}`;
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProductCard({ id, title, category, price, image }) {
  const safeTitle    = safeText(title,    100);
  const safeCategory = safeText(category, 32);
  const safeSrc      = typeof image === "string" && image.trim()
    ? image
    : "/images/placeholder.jpg";
  const displayPrice = formatPrice(price);

  return (
    <>
      <style>{`
        .pc-img{transition:transform .6s cubic-bezier(.16,1,.3,1)}
        .pc-link:hover .pc-img,.pc-link:focus-visible .pc-img{transform:scale(1.06)}
        .pc-card{transition:border-color .2s ease,background .2s ease,transform .2s ease}
        .pc-link:hover .pc-card,.pc-link:focus-visible .pc-card{
          border-color:rgba(255,255,255,.14);
          background:rgba(255,255,255,.035);
          transform:translateY(-3px);
        }
        @media(prefers-reduced-motion:reduce){
          .pc-img,.pc-card{transition:none}
          .pc-link:hover .pc-img,.pc-link:focus-visible .pc-img{transform:none}
          .pc-link:hover .pc-card,.pc-link:focus-visible .pc-card{transform:none}
        }
      `}</style>

      <Link
        href={`/products/${id}`}
        aria-label={`${safeTitle} — ${displayPrice}`}
        className="
          pc-link block
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-white/40 focus-visible:ring-offset-2
          focus-visible:ring-offset-[#080808]
          rounded-3xl
        "
      >
        <article className="pc-card rounded-3xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">

          {/* ── Image ── */}
          <div className="relative h-64 overflow-hidden bg-white/[0.04]">
            <Image
              src={safeSrc}
              alt={safeTitle}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="pc-img object-cover"
              onError={(e) => {
                // Degrade gracefully if image 404s after mount
                e.currentTarget.src = "/images/placeholder.jpg";
              }}
            />

            {/* Category badge */}
            {safeCategory && (
              <div
                aria-hidden
                className="
                  absolute top-3 left-3
                  px-2.5 py-1 rounded-lg
                  border border-white/[0.1] bg-black/60 backdrop-blur-sm
                  text-[0.55rem] font-semibold tracking-[0.18em] uppercase text-white/55
                "
              >
                {safeCategory}
              </div>
            )}
          </div>

          {/* ── Content ── */}
          <div className="p-5 space-y-2">
            <h3 className="text-[0.88rem] font-semibold text-white/90 leading-snug line-clamp-2">
              {safeTitle}
            </h3>

            <div className="flex items-center justify-between pt-1">
              <p className="text-base font-extrabold tracking-tight text-white">
                {displayPrice}
              </p>

              {/* Arrow CTA */}
              <span
                aria-hidden
                className="
                  flex items-center justify-center
                  w-8 h-8 rounded-xl
                  border border-white/[0.1] bg-white/[0.04]
                  text-white/40
                  transition-all duration-200
                  group-hover:border-white/25 group-hover:text-white
                "
              >
                <svg
                  width="13" height="13" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                >
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
            </div>
          </div>
        </article>
      </Link>
    </>
  );
}
