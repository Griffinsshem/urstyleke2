import ProductGrid from "@/components/ProductGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MenPage() {
  return (
    <section className="min-h-screen bg-black text-white px-6 pt-40 pb-32">
      <Navbar />

      <div className="max-w-7xl mx-auto mb-20 text-center">
        <span className="text-xs tracking-[0.35em] uppercase text-gray-400">
          Men
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold mt-6 mb-6">
          Men’s Collection
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Premium essentials crafted with precision and timeless elegance.
        </p>
      </div>

      {/* Products from API */}
      <ProductGrid category="men" />

      <Footer />
    </section>
  );
}
