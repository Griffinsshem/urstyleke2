"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Footer from "@/components/Footer";

import {
  FaUser,
  FaBox,
  FaHeart,
  FaCog,
} from "react-icons/fa";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#070707] text-white pt-28 px-6 relative overflow-hidden">

        {/* glow background */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/5 blur-[140px] rounded-full" />

        <div className="max-w-6xl mx-auto relative z-10 animate-fadeIn">

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome 👋
            </h1>

            {/* SAFE ACCESS FIX */}
            <p className="text-white/40 mt-2">
              {user?.email || "Loading account..."}
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <DashboardCard
              icon={<FaUser />}
              title="Profile"
              desc="Manage your account"
              link="/profile"
            />

            <DashboardCard
              icon={<FaBox />}
              title="Orders"
              desc="View purchase history"
              link="/orders"
            />

            <DashboardCard
              icon={<FaHeart />}
              title="Wishlist"
              desc="Saved products"
              link="/wishlist"
            />

            <DashboardCard
              icon={<FaCog />}
              title="Settings"
              desc="Preferences"
              link="/settings"
            />
          </div>
        </div>

        <Footer />

        {/* animations */}
        <style jsx>{`
          .animate-fadeIn {
            animation: fadeIn 0.7s ease-out both;
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
        `}</style>
      </div>
    </ProtectedRoute>
  );
}

/* Premium card */
function DashboardCard({ icon, title, desc, link }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(link)}
      className="
        group relative
        bg-white/[0.03]
        border border-white/10
        backdrop-blur-xl
        rounded-3xl
        p-6 text-left

        transition-all duration-300
        hover:border-white/25
        hover:bg-white/[0.06]
        hover:scale-[1.03]
        active:scale-[0.98]
      "
    >
      <div className="text-2xl mb-4 text-white/80 group-hover:text-white transition">
        {icon}
      </div>

      <h3 className="font-semibold text-lg mb-1">
        {title}
      </h3>

      <p className="text-sm text-white/40">
        {desc}
      </p>

      {/* subtle glow on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition bg-white/5 blur-xl" />
    </button>
  );
}