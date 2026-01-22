import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-40 px-6 flex items-center justify-center">
        <div className="max-w-md w-full border rounded-2xl p-10">
          <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
          <p className="text-gray-600 text-center">
            Authentication coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
