import { FaCrown } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-black text-white px-6 pt-40 pb-32">
      <Navbar />
      <div className="max-w-5xl mx-auto text-center">
        <FaCrown className="mx-auto mb-6 w-10 h-10 text-gray-400" />

        <h1 className="text-4xl md:text-6xl font-extrabold mb-8">
          About UrStyleKE
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed">
          UrStyleKE is a premium fashion brand dedicated to timeless elegance,
          refined craftsmanship, and modern luxury. Every piece is designed to
          empower confidence and individuality.
        </p>
      </div>
      <Footer />
    </section>
  );
}
