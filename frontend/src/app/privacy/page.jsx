"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaShieldAlt } from "react-icons/fa";

export default function PrivacyPage() {
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

        .grain::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .03;
          background-image:
            radial-gradient(circle at 25% 25%, white 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: 0;
        }
      `}</style>

      <div className="grain min-h-screen bg-[#080808] text-white">
        <Navbar />

        <section
          ref={sectionRef}
          className="relative z-10 px-6 pt-36 pb-24"
        >
          {/* Glow */}
          <div
            aria-hidden
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(255,255,255,.05) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-4xl mx-auto">

            {/* Eyebrow */}
            <div className="reveal delay-1 flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-10 bg-white/20" />

              <span className="text-[11px] uppercase tracking-[0.35em] text-white/40 font-semibold">
                Trust & Security
              </span>

              <div className="h-px w-10 bg-white/20" />
            </div>

            {/* Icon */}
            <div className="reveal delay-1 flex justify-center mb-8">
              <div
                className="
                  w-16 h-16
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.03]
                  flex items-center justify-center
                "
              >
                <FaShieldAlt
                  size={24}
                  className="text-white/70"
                />
              </div>
            </div>

            {/* Title */}
            <h1
              className="
                reveal delay-2
                text-center
                font-extrabold
                tracking-tight
                leading-none
                text-[clamp(2.8rem,7vw,5rem)]
                mb-6
              "
            >
              Privacy{" "}
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage:
                    "linear-gradient(135deg,#ffffff 0%,rgba(255,255,255,.45) 100%)",
                }}
              >
                Policy
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="
                reveal delay-2
                text-center
                max-w-2xl
                mx-auto
                text-white/45
                leading-relaxed
                mb-16
              "
            >
              At UrStyleKe, protecting your personal information is
              fundamental to the trust we build with our customers.
              We are committed to transparency, security, and responsible
              data practices.
            </p>

            {/* Content Card */}
            <div
              className="
                reveal delay-3
                rounded-3xl
                border border-white/[0.08]
                bg-white/[0.03]
                backdrop-blur-xl
                p-8 md:p-12
                space-y-10
              "
            >
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Information We Collect
                </h2>

                <p className="text-white/55 leading-relaxed">
                  We may collect account information such as your email
                  address, authentication details, order history, and
                  shopping activity to provide a seamless shopping
                  experience.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">
                  How We Use Your Information
                </h2>

                <p className="text-white/55 leading-relaxed">
                  Your information is used to process orders, improve
                  our services, personalize your experience, and
                  communicate important updates regarding your account
                  or purchases.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Security
                </h2>

                <p className="text-white/55 leading-relaxed">
                  We implement industry-standard security practices
                  designed to protect customer information from
                  unauthorized access, disclosure, or misuse.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Third-Party Services
                </h2>

                <p className="text-white/55 leading-relaxed">
                  Certain services may be provided by trusted
                  third-party providers. These providers only receive
                  the information necessary to perform their services
                  and are expected to maintain appropriate safeguards.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Your Rights
                </h2>

                <p className="text-white/55 leading-relaxed">
                  You have the right to request access to, correction
                  of, or deletion of your personal information where
                  applicable under relevant privacy regulations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}