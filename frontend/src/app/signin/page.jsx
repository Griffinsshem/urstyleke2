import { FaUserLock } from "react-icons/fa";
import Navbar from "@/components/Navbar";

export default function SignInPage() {
  return (
    <section className="min-h-screen bg-black text-white px-6 pt-40 pb-32 flex items-center justify-center">
      <Navbar />
      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-md rounded-2xl p-10 border border-white/10">
        <FaUserLock className="mx-auto mb-6 w-8 h-8 text-gray-400" />

        <h1 className="text-3xl font-bold text-center mb-8">
          Sign In
        </h1>

        <form className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none"
          />

          <button className="w-full py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition">
            Continue
          </button>
        </form>
      </div>
    </section>
  );
}
