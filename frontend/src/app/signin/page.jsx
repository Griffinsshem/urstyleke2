"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { signIn } from "@/lib/auth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    signIn({ email });
    router.push("/");
  };

  return (
    <section className="min-h-screen bg-black text-white pt-32 px-6">
      <Navbar />

      <div className="max-w-md mx-auto bg-neutral-900 border border-white/10 rounded-2xl p-10 mt-20">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-white/20 rounded-full px-6 py-4
            text-sm placeholder-gray-500 focus:outline-none focus:border-white"
          />

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-white text-black font-semibold
            hover:scale-[1.02] transition"
          >
            Continue
          </button>
        </form>
      </div>

      <Footer />
    </section>
  );
}
