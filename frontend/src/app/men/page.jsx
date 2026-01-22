import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MenPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-40 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Men</h1>
          <p className="text-gray-600">
            Premium menswear crafted for confidence and timeless style.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
