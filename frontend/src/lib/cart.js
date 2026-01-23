export function getCart() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("cart")) || [];
}

export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateQuantity(id, quantity) {
  const cart = getCart().map(item =>
    item.id === id ? { ...item, quantity } : item
  );

  localStorage.setItem("cart", JSON.stringify(cart));
}

export function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
}
