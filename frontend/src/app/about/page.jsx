import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-40 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About UrStyleKE</h1>
          <p className="text-gray-600 leading-relaxed">
            UrStyleKE is a premium fashion brand dedicated to craftsmanship,
            elegance, and modern luxury for the confident individual.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
