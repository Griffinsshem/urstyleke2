"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaSignInAlt } from "react-icons/fa";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();

    // TEMP: frontend-only auth
    alert("Signed in successfully");
    window.location.href = "/";
  };

  return (
    <section className="min-h-screen bg-black text-white pt-32 px-6">
      <Navbar />

      <div className="max-w-md mx-auto bg-neutral-900 border border-white/10 rounded-2xl p-10">
        {/* Header */}
        <div className="text-center mb-10">
          <FaSignInAlt className="mx-auto mb-4 text-gray-400 w-8 h-8" />
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">
            Sign in to continue your premium experience
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-6">
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3
            text-sm focus:outline-none focus:border-white transition"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3
            text-sm focus:outline-none focus:border-white transition"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-white text-black
            font-semibold hover:scale-[1.02] transition"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-8">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-white hover:underline transition"
          >
            Register
          </Link>
        </p>
      </div>

      <Footer />
    </section>
  );
}
