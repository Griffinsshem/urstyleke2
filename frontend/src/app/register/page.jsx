"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";
import { registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerUser({ name, email, password });
      alert("Account created successfully. Please sign in.");
      window.location.href = "/signin";
    } catch (err) {
      alert(err.message);
    }
  };


  return (
    <section className="min-h-screen bg-black text-white pt-32 px-6">
      <Navbar />

      <div className="max-w-md mx-auto bg-neutral-900 border border-white/10 rounded-2xl p-10">
        {/* Header */}
        <div className="text-center mb-10">
          <FaUserPlus className="mx-auto mb-4 text-gray-400 w-8 h-8" />
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">
            Register to access premium fashion collections
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3
            text-sm focus:outline-none focus:border-white transition"
          />

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
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-8">
          Already have an account?{" "}
          <Link href="/signin" className="text-white hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      <Footer />
    </section>
  );
}
