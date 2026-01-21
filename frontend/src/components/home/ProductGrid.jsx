const products = [
  { id: 1, name: "Luxury Jacket", price: "KES 8,500" },
  { id: 2, name: "Premium Hoodie", price: "KES 6,200" },
  { id: 3, name: "Classic Shirt", price: "KES 4,800" },
];

export default function ProductGrid() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Featured Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map(product => (
            <div
              key={product.id}
              className="border rounded-2xl p-6 hover:shadow-xl transition"
            >
              <div className="h-64 bg-gray-100 rounded-xl mb-6" />
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-600">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
