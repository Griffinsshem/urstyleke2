"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {
  FaUser,
  FaBox,
  FaHeart,
  FaCog,
} from "react-icons/fa";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  /* Protect route */
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-6">

      <div className="max-w-6xl mx-auto">
        <Navbar />

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome 👋
          </h1>

          <p className="text-gray-400">
            {user.email}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Profile */}
          <DashboardCard
            icon={<FaUser />}
            title="Profile"
            desc="Manage your account"
            link="/profile"
          />

          {/* Orders */}
          <DashboardCard
            icon={<FaBox />}
            title="Orders"
            desc="View purchase history"
            link="/orders"
          />

          {/* Wishlist */}
          <DashboardCard
            icon={<FaHeart />}
            title="Wishlist"
            desc="Saved products"
            link="/wishlist"
          />

          {/* Settings */}
          <DashboardCard
            icon={<FaCog />}
            title="Settings"
            desc="Preferences"
            link="/settings"
          />

        </div>
        <Footer />
      </div>
    </div>
  );
}

/* =========================
   CARD COMPONENT
========================= */

function DashboardCard({ icon, title, desc, link }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(link)}
      className="
        bg-gray-900
        border border-gray-800
        rounded-2xl
        p-6
        text-left
        hover:border-white/30
        hover:scale-[1.02]
        transition
      "
    >
      <div className="text-2xl mb-4 text-white">
        {icon}
      </div>

      <h3 className="font-semibold text-lg mb-1">
        {title}
      </h3>

      <p className="text-sm text-gray-400">
        {desc}
      </p>
    </button>
  );
}
