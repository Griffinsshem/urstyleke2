"use client";

import { useEffect, useState, useRef, useId } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      aria-hidden
      className="rounded-3xl border border-white/[0.07] bg-white/[0.02] overflow-hidden animate-pulse"
    >
      <div className="h-64 bg-white/[0.05]" />
      <div className="p-6 space-y-3">
        <div className="h-2.5 w-16 rounded-full bg-white/[0.07]" />
        <div className="h-4 w-2/3 rounded-full bg-white/[0.06]" />
        <div className="h-5 w-1/3 rounded-full bg-white/[0.08]" />
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MenPage() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const heroRef   = useRef(null);
  const gridRef   = useRef(null);
  const headingId = useId();

  // Entrance animations
  useEffect(() => {
    const refs = [heroRef, gridRef];
    const observers = refs.map((ref) => {
      const el = ref.current;
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { el.classList.add("section--vis"); obs.disconnect(); }
        },
        { threshold: 0.07 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { getProducts } = await import("@/lib/products");
        const data = await getProducts();

        const safe = (Array.isArray(data) ? data : [])
          .filter(
            (item) =>
              item &&
              typeof item.id       !== "undefined" &&
              typeof item.title    === "string"     &&
              typeof item.category === "string"     &&
              typeof item.price    === "number"
          )
          .filter((item) => item.category === "men")
          .slice(0, 6);

        setProducts(safe);
      } catch (err) {
        console.error("[MenPage] Failed to load products:", err);
        setError("Unable to load products right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <>
      <style>{`
        .reveal{opacity:0;transform:translateY(20px);transition:opacity .72s cubic-bezier(.16,1,.3,1),transform .72s cubic-bezier(.16,1,.3,1)}
        .section--vis .reveal{opacity:1;transform:translateY(0)}
        .d1{transition-delay:.06s}.d2{transition-delay:.18s}.d3{transition-delay:.30s}.d4{transition-delay:.44s}
        .page-grain::before{content:"";position:fixed;inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:180px 180px;opacity:.033;pointer-events:none;z-index:0}
        .page-grid::after{content:"";position:fixed;inset:0;
          background-image:linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px);
          background-size:60px 60px;pointer-events:none;z-index:0}
        @media(prefers-reduced-motion:reduce){
          .reveal,.section--vis .reveal{transition:none;opacity:1;transform:none}}
      `}</style>

      <div className="page-grain page-grid relative min-h-screen bg-[#080808] text-white">
        <Navbar />

        {/* Hero */}
        <section
          ref={heroRef}
          role="region"
          aria-labelledby={headingId}
          className="relative z-10 pt-36 pb-20 px-6 sm:px-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] rounded-full"
            style={{ background: "radial-gradient(ellipse,rgba(255,255,255,0.04) 0%,transparent 70%)" }}
          />
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="reveal d1 flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-8 bg-white/22" aria-hidden />
              <span className="text-[0.6rem] font-semibold tracking-[0.38em] uppercase text-white/38">
                Men's Fashion
              </span>
              <div className="h-px w-8 bg-white/22" aria-hidden />
            </div>
            <h1
              id={headingId}
              className="reveal d2 font-extrabold leading-[0.92] tracking-[-0.03em] text-[clamp(2.6rem,7vw,5rem)] text-white mb-7"
            >
              Men's{" "}
              <span style={{
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                backgroundImage:"linear-gradient(135deg,#ffffff 0%,rgba(255,255,255,0.46) 100%)",
                backgroundClip:"text",
              }}>
                Collection
              </span>
            </h1>
            <p className="reveal d3 max-w-xl mx-auto text-[0.9rem] leading-[1.78] text-white/40 tracking-wide">
              Precision-cut, deliberately crafted. Pieces for the man who
              moves through the world with intention and style.
            </p>
          </div>
        </section>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
          <div className="h-px bg-white/[0.06]" aria-hidden />
        </div>

        {/* Products */}
        <section
          ref={gridRef}
          aria-label="Men's products"
          className="relative z-10 py-20 px-6 sm:px-10"
        >
          <div className="max-w-7xl mx-auto">
            {loading && (
              <div aria-label="Loading products" aria-busy="true"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}
            {!loading && error && (
              <div role="alert" className="max-w-md mx-auto flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.08] p-5 text-sm text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}
            {!loading && !error && <ProductGrid products={products} />}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
