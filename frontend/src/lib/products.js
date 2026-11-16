import { API_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";

export async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch products error:", error);
    return [];
  }
}

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
  const res = await authFetch("/products", {
    method: "POST",
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
  const res = await authFetch(`/products/${id}`, {
    method: "PUT",
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
  const res = await authFetch(`/products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }

  return res.json();
}
