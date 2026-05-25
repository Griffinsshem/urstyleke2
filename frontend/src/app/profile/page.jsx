"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/auth";

import { FaUser, FaLock, FaSave } from "react-icons/fa";
import ProtectedRoute from "@/components/ProtectedRoute";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const { user } = useAuth();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMsg("");

    try {
      const res = await authFetch("/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMsg("Profile updated successfully ");
      setPassword("");
    } catch (err) {
      setMsg("Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#070707] text-white pt-28 px-6 relative overflow-hidden">

        {/* soft glow background */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full" />

        <div className="max-w-xl mx-auto relative z-10 animate-fadeIn">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <FaUser className="text-white/70" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Your Profile
            </h1>

            <p className="text-white/40 text-sm mt-2">
              Manage your account securely
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.6)] transition hover:border-white/20">

            {/* Email */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-2">
                Email Address
              </p>
              <p className="text-white/80 font-medium">
                {user.email}
              </p>
            </div>

            {/* Message */}
            {msg && (
              <div className="mb-5 text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center animate-pulse">
                {msg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Password */}
              <div>
                <label className="text-xs uppercase tracking-widest text-white/40">
                  New Password
                </label>

                <div className="relative mt-2">
                  <FaLock className="absolute left-4 top-3.5 text-white/30" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new secure password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 outline-none focus:border-white/30 focus:bg-white/[0.07] transition"
                  />
                </div>
              </div>

              {/* Button */}
              <button
                disabled={loading}
                className="
                  w-full flex items-center justify-center gap-2
                  bg-white text-black font-semibold
                  py-3 rounded-xl
                  hover:scale-[1.02] active:scale-[0.98]
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                <FaSave />
                {loading ? "Saving..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>

        <Footer />

        {/* animations */}
        {/* <style jsx>{`
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out both;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style> */}
      </div>
    </ProtectedRoute>
  );
}

