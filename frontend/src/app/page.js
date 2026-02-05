import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <>
      <ProtectedRoute>
        <Navbar />
        <Hero />
        <Footer />
      </ProtectedRoute>
    </>
  );
}
