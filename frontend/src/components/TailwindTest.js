export default function TailwindTest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 rounded-2xl shadow-xl bg-black text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Tailwind is Working 🎉</h1>
        <p className="text-gray-300">
          Premium UI styles are ready to go.
        </p>
        <button className="mt-6 px-6 py-3 bg-white text-black rounded-full font-semibold hover:scale-105 transition">
          Test Button
        </button>
      </div>
    </div>
  );
}
