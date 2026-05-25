"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiCheck, FiArrowRight, FiShoppingBag } from "react-icons/fi";

export default function SuccessPage() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;

    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("section--visible");
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity .8s cubic-bezier(.16,1,.3,1),
            transform .8s cubic-bezier(.16,1,.3,1);
        }

        .section--visible .reveal {
          opacity: 1;
          transform: translateY(0);
        }

        .delay-1 { transition-delay: .1s; }
        .delay-2 { transition-delay: .25s; }
        .delay-3 { transition-delay: .4s; }

        .grain::before{
          content:"";
          position:fixed;
          inset:0;
          pointer-events:none;
          opacity:.03;
          background-image:
            radial-gradient(circle at 25% 25%, white 1px, transparent 1px);
          background-size:40px 40px;
          z-index:0;
        }
      `}</style>

      <div className="grain min-h-screen bg-[#080808] text-white">
        <Navbar />

        <section
          ref={sectionRef}
          className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24 pb-24"
        >
          {/* Glow */}
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(255,255,255,.05) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-3xl mx-auto text-center">

            {/* Success Icon */}
            <div className="reveal delay-1 flex justify-center mb-8">
              <div
                className="
                  w-20 h-20
                  rounded-full
                  border border-white/10
                  bg-white/[0.04]
                  flex items-center justify-center
                "
              >
                <FiCheck
                  size={34}
                  className="text-white"
                />
              </div>
            </div>

            {/* Eyebrow */}
            <div className="reveal delay-1 flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-10 bg-white/20" />

              <span className="text-[11px] uppercase tracking-[0.35em] text-white/40 font-semibold">
                Order Confirmed
              </span>

              <div className="h-px w-10 bg-white/20" />
            </div>

            {/* Heading */}
            <h1
              className="
                reveal delay-2
                text-[clamp(3rem,8vw,5.5rem)]
                font-extrabold
                tracking-tight
                leading-none
                mb-6
              "
            >
              Payment{" "}
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage:
                    "linear-gradient(135deg,#ffffff 0%,rgba(255,255,255,.45) 100%)",
                }}
              >
                Successful
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                reveal delay-2
                max-w-2xl
                mx-auto
                text-white/45
                leading-relaxed
                mb-12
              "
            >
              Thank you for choosing UrStyleKe.
              Your order has been successfully placed and
              is now being processed. We appreciate your trust
              in our brand and look forward to delivering your
              premium fashion experience.
            </p>

            {/* Card */}
            <div
              className="
                reveal delay-3
                rounded-3xl
                border border-white/[0.08]
                bg-white/[0.03]
                backdrop-blur-xl
                p-8
                mb-10
              "
            >
              <div className="flex items-center justify-center gap-3 text-white/70">
                <FiShoppingBag size={18} />
                <span className="font-medium">
                  Your order is confirmed and ready for processing
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="reveal delay-3 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/orders"
                className="
                  inline-flex items-center justify-center gap-2
                  px-8 py-4 rounded-xl
                  bg-white text-black
                  font-semibold
                  hover:bg-white/90
                  transition-all duration-200
                "
              >
                View Orders
                <FiArrowRight size={15} />
              </Link>

              <Link
                href="/collection"
                className="
                  inline-flex items-center justify-center
                  px-8 py-4 rounded-xl
                  border border-white/15
                  text-white/70
                  hover:text-white
                  hover:border-white/30
                  hover:bg-white/[0.04]
                  transition-all duration-200
                "
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}