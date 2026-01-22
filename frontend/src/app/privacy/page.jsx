import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-40 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-gray-600">
            Your privacy matters. Full policy details will be available here.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
