import { authFetch, isAuthenticated } from "@/lib/auth";

export async function createOrder(items) {
  if (!isAuthenticated()) {
    throw new Error("User not authenticated");
  }

  const res = await authFetch("/orders", {
    method: "POST",
    body: JSON.stringify({ items }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Failed to create order");
  }

  return data;
}

export async function getOrders() {
  const res = await authFetch("/orders");

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}

export async function getOrder(orderId) {
  const res = await authFetch(`/orders/${orderId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch order");
  }

  return res.json();
}
