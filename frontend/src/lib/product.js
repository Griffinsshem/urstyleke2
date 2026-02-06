// src/lib/products.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

/**
 * Get JWT token from localStorage
 */
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

/**
 * Get all products
 */
export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

/**
 * Get single product
 */
export async function getProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}

/**
 * Create product (Admin)
 */
export async function createProduct(data) {
  const token = getToken();

  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create product");
  }

  return res.json();
}

/**
 * Update product
 */
export async function updateProduct(id, data) {
  const token = getToken();

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update product");
  }

  return res.json();
}

/**
 * Delete product
 */
export async function deleteProduct(id) {
  const token = getToken();

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }

  return res.json();
}
