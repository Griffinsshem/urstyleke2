export default function Hero() {
  return (
    <section className="relative min-h-screen bg-black text-white flex items-center justify-center px-6 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black opacity-90" />

      <div className="relative z-10 max-w-5xl text-center">
        <span className="inline-block mb-6 text-xs tracking-[0.3em] uppercase text-gray-400">
          Premium Fashion Brand
        </span>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8">
          Redefine <br className="hidden md:block" />
          Modern Luxury
        </h1>

        <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl mb-12">
          Timeless pieces crafted for individuals who value elegance,
          confidence, and uncompromising quality.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-5">
          <button className="px-10 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition">
            Shop Collection
          </button>

          <button className="px-10 py-4 border border-white/40 rounded-full hover:bg-white hover:text-black transition">
            About
          </button>
        </div>
      </div>
    </section>
  );
}
