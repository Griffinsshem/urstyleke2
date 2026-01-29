// src/lib/auth.js

const API_URL = "http://127.0.0.1:5000";

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("auth-user"));
};

export const getUser = () => {
  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem("auth-user"));
};

export const signOut = () => {
  localStorage.removeItem("auth-user");
  window.dispatchEvent(new Event("auth-changed"));
};

export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Registration failed");

  return data;
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Login failed");

  localStorage.setItem("auth-user", JSON.stringify(data.user));
  window.dispatchEvent(new Event("auth-changed"));

  return data.user;
};
