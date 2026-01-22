import { FaShieldAlt } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <section className="min-h-screen bg-black text-white px-6 pt-40 pb-32">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <FaShieldAlt className="mb-6 w-8 h-8 text-gray-400" />

        <h1 className="text-3xl font-bold mb-6">
          Privacy Policy
        </h1>

        <p className="text-gray-400 leading-relaxed">
          We respect your privacy. All personal data is handled securely and
          never shared without consent.
        </p>
      </div>
      <Footer />
    </section>
  );
}
