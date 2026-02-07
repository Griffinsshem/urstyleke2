import ProductGrid from "@/components/ProductGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WomenPage() {
  return (
    <section className="min-h-screen bg-black text-white px-6 pt-40 pb-32">
      <Navbar />

      <div className="max-w-7xl mx-auto mb-20 text-center">
        <span className="text-xs tracking-[0.35em] uppercase text-gray-400">
          Women
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold mt-6 mb-6">
          Women’s Collection
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Elegant silhouettes designed for modern confidence and grace.
        </p>
      </div>

      {/* Products from API */}
      <ProductGrid category="women" />

      <Footer />
    </section>
  );
}
