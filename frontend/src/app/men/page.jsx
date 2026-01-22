import { FaShoppingBag } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const products = Array.from({ length: 9 });

export default function MenPage() {
  return (
    <section className="min-h-screen bg-black text-white px-6 pt-40 pb-32">
      {/* Page Header */}
      <Navbar />
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <span className="text-xs tracking-[0.35em] uppercase text-gray-400">
          Men
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold mt-6 mb-6">
          Men’s Collection
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Premium essentials crafted with precision, confidence, and timeless
          luxury.
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {products.map((_, index) => (
          <div
            key={index}
            className="group bg-neutral-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition"
          >
            {/* Image Placeholder */}
            <div className="h-64 bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center">
              <FaShoppingBag className="w-10 h-10 text-gray-500 group-hover:scale-110 transition" />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                Premium Menswear
              </h3>

              <p className="text-sm text-gray-400 mb-6">
                Tailored for refined comfort and modern elegance.
              </p>

              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 text-xs tracking-[0.25em] uppercase rounded-full border border-white/30 hover:bg-white hover:text-black transition">
                Book
                <FiArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </section>
  );
}
