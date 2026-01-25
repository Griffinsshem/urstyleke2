"use client";

import Link from "next/link";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

export default function RegisterPage() {
  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-white/10 rounded-2xl p-10">
        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Register before signing in
        </p>

        <form className="space-y-5">
          <div className="flex items-center gap-3 border border-white/10 rounded-lg px-4 py-3">
            <FiUser className="text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <div className="flex items-center gap-3 border border-white/10 rounded-lg px-4 py-3">
            <FiMail className="text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <div className="flex items-center gap-3 border border-white/10 rounded-lg px-4 py-3">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-full bg-white text-black text-sm font-semibold hover:opacity-90 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Already registered?{" "}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
