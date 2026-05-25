"use client";

import { useEffect, useState, useRef, useId, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/orders";
import { getCart, removeFromCart, clearCart } from "@/lib/cart";
import { FiShoppingBag, FiTrash2, FiArrowRight, FiPackage } from "react-icons/fi";

const safeText = (str, max = 120) => {
  if (typeof str !== "string") return "Untitled item";
  return str.replace(/[<>"']/g, "").trim().slice(0, max) || "Untitled item";
};

const formatPrice = (n) => {
  if (typeof n !== "number" || !isFinite(n) || n < 0) return "—";
  return `KES ${Math.round(n).toLocaleString("en-KE")}`;
};

const safeQty = (q) => {
  const n = parseInt(q, 10);
  return isFinite(n) && n > 0 ? n : 1;
};

const isValidItem = (item) =>
  item &&
  typeof item.id    !== "undefined"  &&
  typeof item.title === "string"     &&
  typeof item.price === "number"     &&
  isFinite(item.price)               &&
  item.price >= 0;

// ─── Sub-components ───────────────────────────────────────────────────────────
function CartItem({ item, onRemove }) {
  const title    = safeText(item.title);
  const qty      = safeQty(item.quantity);
  const lineTotal = formatPrice(item.price * qty);
  const unitPrice = formatPrice(item.price);

  return (
    <li className="
      group flex items-center justify-between gap-4
      rounded-3xl border border-white/[0.07] bg-white/[0.02]
      p-5 sm:p-6
      transition-all duration-200
      hover:border-white/[0.13] hover:bg-white/[0.035]
    ">
      {/* Icon + details */}
      <div className="flex items-center gap-4 min-w-0">
        <div
          aria-hidden
          className="
            shrink-0 flex items-center justify-center
            w-11 h-11 rounded-2xl
            border border-white/[0.08] bg-white/[0.04]
            text-white/30
          "
        >
          <FiShoppingBag size={16} />
        </div>

        <div className="min-w-0">
          <h3 className="text-[0.88rem] font-semibold text-white/90 truncate">
            {title}
          </h3>
          <p className="mt-0.5 text-[0.72rem] text-white/38">
            Qty: <span className="text-white/55 font-medium">{qty}</span>
            <span className="mx-2 text-white/20" aria-hidden>·</span>
            {unitPrice} each
          </p>
        </div>
      </div>

      {/* Line total + remove */}
      <div className="flex items-center gap-5 shrink-0">
        <span className="text-[0.92rem] font-extrabold tracking-tight text-white">
          {lineTotal}
        </span>

        <button
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${title} from cart`}
          className="
            flex items-center justify-center
            w-8 h-8 rounded-xl
            border border-white/[0.08] bg-white/[0.03]
            text-white/28
            hover:border-red-500/30 hover:bg-red-500/[0.08] hover:text-red-400
            transition-all duration-150
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-red-500/40
          "
        >
          <FiTrash2 size={13} aria-hidden />
        </button>
      </div>
    </li>
  );
}

export default function CheckoutPage() {
  const [cart,    setCart]    = useState([]);
  const [ready,   setReady]   = useState(false);
  const heroRef   = useRef(null);
  const headingId = useId();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const validCart = cart.filter(isValidItem);

  const total = validCart.reduce(
    (sum, item) => sum + item.price * safeQty(item.quantity),
    0
  );

  const syncCart = useCallback(() => {
    try {
      const data = getCart();
      setCart(Array.isArray(data) ? data : []);
    } catch {
      setCart([]);
    }
  }, []);

  const handleCheckout = useCallback(async () => {
    try {
      setLoading(true);
      const items = validCart.map((item) => ({
        id: item.id,
        quantity: safeQty(item.quantity),
      }));

      const res = await createOrder(items);

      localStorage.setItem("last_order_id", res.order_id);

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-updated"));
      router.push("/payment");
    } catch (error) {
      console.error(err.message);
      alert(error.message || "checkout failed");
    } finally {
      setLoading(false);
    }
  }, [validCart, router]);

  useEffect(() => {
    syncCart();
    setReady(true);
    window.addEventListener("cart-updated", syncCart);
    window.addEventListener("storage",      syncCart);
    return () => {
      window.removeEventListener("cart-updated", syncCart);
      window.removeEventListener("storage",      syncCart);
    };
  }, [syncCart]);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("section--vis"); obs.disconnect(); } },
      { threshold: 0.07 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleRemove = useCallback((id) => {
    removeFromCart(id);
    syncCart();
  }, [syncCart]);

  return (
    <>
      <style>{`
        .reveal{opacity:0;transform:translateY(20px);transition:opacity .72s cubic-bezier(.16,1,.3,1),transform .72s cubic-bezier(.16,1,.3,1)}
        .section--vis .reveal{opacity:1;transform:translateY(0)}
        .d1{transition-delay:.06s}.d2{transition-delay:.18s}.d3{transition-delay:.28s}.d4{transition-delay:.38s}
        .page-grain::before{content:"";position:fixed;inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:180px 180px;opacity:.033;pointer-events:none;z-index:0}
        .page-grid::after{content:"";position:fixed;inset:0;
          background-image:linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px);
          background-size:60px 60px;pointer-events:none;z-index:0}
        .btn-shimmer{position:relative;overflow:hidden}
        .btn-shimmer::after{content:"";position:absolute;top:0;left:-100%;width:60%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(0,0,0,.06),transparent);transition:left .4s ease}
        .btn-shimmer:hover::after{left:140%}
        .btn-shimmer:hover .btn-arrow{transform:translateX(2px)}
        .btn-arrow{transition:transform .2s ease}
        @media(prefers-reduced-motion:reduce){
          .reveal,.section--vis .reveal{transition:none;opacity:1;transform:none}
          .btn-shimmer::after{display:none}
          .btn-arrow{transition:none}
        }
      `}</style>

      <div className="page-grain page-grid relative min-h-screen bg-[#080808] text-white">
        <Navbar />

        <section
          ref={heroRef}
          role="region"
          aria-labelledby={headingId}
          className="relative z-10 pt-36 pb-24 px-6 sm:px-10"
        >
          {/* Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] rounded-full"
            style={{ background: "radial-gradient(ellipse,rgba(255,255,255,0.04) 0%,transparent 70%)" }}
          />

          <div className="relative max-w-3xl mx-auto">

            {/* Eyebrow */}
            <div className="reveal d1 flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-8 bg-white/22" aria-hidden />
              <span className="text-[0.6rem] font-semibold tracking-[0.38em] uppercase text-white/38">
                Your Order
              </span>
              <div className="h-px w-8 bg-white/22" aria-hidden />
            </div>

            {/* Heading */}
            <h1
              id={headingId}
              className="
                reveal d2
                font-extrabold leading-[0.92] tracking-[-0.03em]
                text-[clamp(2.2rem,6vw,4rem)] text-white text-center mb-12
              "
            >
              Review &{" "}
              <span style={{
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundImage: "linear-gradient(135deg,#ffffff 0%,rgba(255,255,255,0.46) 100%)",
                backgroundClip: "text",
              }}>
                Checkout
              </span>
            </h1>

            {/* ── Empty state ─────────────────────────────────────────────── */}
            {ready && validCart.length === 0 && (
              <div
                role="status"
                aria-live="polite"
                className="reveal d3 flex flex-col items-center justify-center py-20 text-center"
              >
                <div
                  aria-hidden
                  className="
                    mb-6 flex items-center justify-center
                    w-16 h-16 rounded-2xl
                    border border-white/[0.08] bg-white/[0.03]
                    text-white/22
                  "
                >
                  <FiPackage size={24} />
                </div>
                <p className="text-[0.88rem] font-semibold text-white/32 mb-1">
                  Your cart is empty
                </p>
                <p className="text-[0.78rem] text-white/22 mb-8">
                  Looks like you haven't added anything yet.
                </p>
                <Link
                  href="/collection"
                  className="
                    inline-flex items-center gap-2
                    px-7 py-3 rounded-xl
                    border border-white/[0.12] text-white/55
                    text-xs font-bold tracking-[0.13em] uppercase
                    hover:border-white/28 hover:text-white hover:bg-white/[0.04]
                    transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-white/30 focus-visible:ring-offset-2
                    focus-visible:ring-offset-[#080808]
                  "
                >
                  Browse Collection
                  <FiArrowRight size={13} aria-hidden />
                </Link>
              </div>
            )}

            {/* ── Cart items ──────────────────────────────────────────────── */}
            {ready && validCart.length > 0 && (
              <div className="reveal d3 space-y-3">

                <ul
                  role="list"
                  aria-label="Cart items"
                  className="space-y-3"
                >
                  {validCart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={handleRemove}
                    />
                  ))}
                </ul>

                {/* ── Summary ─────────────────────────────────────────────── */}
                <div className="
                  mt-6 rounded-3xl border border-white/[0.07]
                  bg-white/[0.02] p-6 space-y-4
                ">
                  {/* Item count */}
                  <div className="flex items-center justify-between text-[0.78rem] text-white/40">
                    <span>
                      {validCart.length} item{validCart.length !== 1 ? "s" : ""}
                    </span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  {/* Shipping note */}
                  <div className="flex items-center justify-between text-[0.78rem] text-white/38">
                    <span>Shipping</span>
                    <span className="text-white/28 italic">Calculated at payment</span>
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-white/[0.06]" aria-hidden />

                  {/* Order total */}
                  <div className="flex items-center justify-between">
                    <span className="text-[0.82rem] font-semibold text-white/70">
                      Order total
                    </span>
                    <span className="text-xl font-extrabold tracking-tight text-white">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* ── CTA ────────────────────────────────────────────────── */}
                <button
                  onClick={handleCheckout}
                  disabled={loading || validCart.length === 0}
                  className="
                    btn-shimmer
                    mt-2 flex items-center justify-center gap-2
                    w-full py-3.5 rounded-xl
                    bg-white text-black
                    text-xs font-bold tracking-[0.14em] uppercase
                    hover:bg-white/90 active:scale-[0.99]
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-white/60 focus-visible:ring-offset-2
                    focus-visible:ring-offset-[#080808]
                  "
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                  <FiArrowRight size={14} className="btn-arrow" aria-hidden />
                </button>

                {/* Security note */}
                <p className="text-center text-[0.62rem] text-white/20 select-none pt-1">
                  Protected by industry-standard encryption
                </p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
