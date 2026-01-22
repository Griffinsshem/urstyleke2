import { FaFileContract } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <section className="min-h-screen bg-black text-white px-6 pt-40 pb-32">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <FaFileContract className="mb-6 w-8 h-8 text-gray-400" />

        <h1 className="text-3xl font-bold mb-6">
          Terms & Conditions
        </h1>

        <p className="text-gray-400 leading-relaxed">
          By using UrStyleKE, you agree to our terms of service and usage
          guidelines designed to protect both our customers and brand.
        </p>
      </div>
      <Footer />
    </section>
  );
}
