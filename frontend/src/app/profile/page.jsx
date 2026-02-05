"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/auth";

import { FaUser, FaLock, FaSave } from "react-icons/fa";

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
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMsg("Profile updated successfully");
      setPassword("");
    } catch (err) {
      setMsg("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-6">

      <div className="max-w-lg mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-8">

        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaUser /> Profile
        </h1>

        {/* Info */}
        <p className="text-gray-400 mb-6">
          Email: {user.email}
        </p>

        {/* Message */}
        {msg && (
          <div className="bg-white/10 border border-white/20 p-3 rounded mb-4 text-sm text-center">
            {msg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-1 text-sm">
              New Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-gray-400" />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full bg-gray-800 border border-gray-700
                  rounded-lg pl-10 pr-3 py-2.5
                  focus:outline-none focus:ring-2 focus:ring-white/20
                "
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-2
              bg-white text-black font-medium
              py-2.5 rounded-lg
              hover:bg-gray-200
              transition
            "
          >
            <FaSave />
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}
