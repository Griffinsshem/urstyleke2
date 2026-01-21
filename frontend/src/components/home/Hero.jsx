export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Elevate Your Style
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mb-10">
          Premium fashion crafted for confidence, elegance, and modern living.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition">
            Shop Collection
          </button>
          <button className="px-8 py-4 border border-white rounded-full hover:bg-white hover:text-black transition">
            Explore Brand
          </button>
        </div>
      </div>
    </section>
  );
}
