import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-40 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-gray-600">
            Terms and conditions governing the use of UrStyleKE.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
