const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("urstyleke_token");
}

export async function createOrder(items) {
  const token = getToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Failed to create order");
  }

  return data;
}

export async function getOrders() {
  const token = getToken();

  const res = await fetch(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}

export async function getOrder(orderId) {
  const token = getToken();

  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch order");
  }

  return res.json();
}


export async function payOrder(orderId) {
  const token = getToken();

  const res = await fetch(
    `${API_URL}/orders/${orderId}/pay`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Payment failed");
  }

  return data;
}