import { FaLayerGroup } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CollectionPage() {
  return (
    <section className="min-h-screen bg-black text-white px-6 pt-40 pb-32">
      <Navbar />
      <div className="max-w-6xl mx-auto text-center">
        <FaLayerGroup className="mx-auto mb-6 w-10 h-10 text-gray-400" />

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Full Collection
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Explore our complete range of premium pieces crafted with precision
          and uncompromising quality.
        </p>
      </div>
      <Footer />
    </section>
  );
}
