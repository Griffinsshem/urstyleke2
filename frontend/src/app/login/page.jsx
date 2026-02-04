"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";

import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginUser({ email, password });

      // Redirect after login
      router.push("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-gray-900 text-white p-8 rounded-2xl shadow-xl border border-gray-800">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-400 mb-6">
          Login to UrStyleKe
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-400 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Email
            </label>

            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 text-gray-400" />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="
                  w-full bg-gray-800 border border-gray-700
                  rounded-lg pl-10 pr-3 py-2.5
                  text-white placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-white/20
                "
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Password
            </label>

            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 text-gray-400" />

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full bg-gray-800 border border-gray-700
                  rounded-lg pl-10 pr-3 py-2.5
                  text-white placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-white/20
                "
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-2
              bg-white text-black font-medium
              py-2.5 rounded-lg
              hover:bg-gray-200 transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <FiLogIn />

            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Secure access to your account
        </p>
      </div>
    </div>
  );
}
