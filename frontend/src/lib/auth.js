

const API_URL = "http://127.0.0.1:5000";

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("auth-user"));
};

export const signIn = (user) => {
  localStorage.setItem("auth-user", JSON.stringify(user));
  window.dispatchEvent(new Event("auth-changed"));
};

export const signOut = () => {
  localStorage.removeItem("auth-user");
  window.dispatchEvent(new Event("auth-changed"));
};

export const getUser = () => {
  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem("auth-user"));
};

/* =========================
   API CALLS (NEW)
   ========================= */

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Registration failed");
  }

  signIn(result.user);
  return result;
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  signIn(result.user);
  return result;
};
