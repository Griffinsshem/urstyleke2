export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-4">UrStyleKE</h3>
          <p className="text-sm">
            Premium fashion designed for confidence and modern elegance.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li>Men</li>
            <li>Women</li>
            <li>New Arrivals</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>

      <p className="text-center text-xs mt-10">
        © {new Date().getFullYear()} UrStyleKE. All rights reserved.
      </p>
    </footer>
  );
}
