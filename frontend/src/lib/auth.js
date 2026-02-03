// src/lib/auth.js

const API_URL = "http://127.0.0.1:5000/api";

// Storage keys
const TOKEN_KEY = "urstyleke_token";
const USER_KEY = "urstyleke_user";

/* =========================
   AUTH STATE HELPERS
========================= */

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(TOKEN_KEY));
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getUser = () => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const signOut = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  window.dispatchEvent(new Event("auth-changed"));
};

/* =========================
   AUTH API CALLS
========================= */

export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  // Save JWT + user
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      id: data.user_id,
      email: data.email,
    })
  );

  window.dispatchEvent(new Event("auth-changed"));

  return data;
};

/* =========================
   AUTH FETCH (JWT REQUESTS)
========================= */

export const authFetch = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  // Auto logout if token expired
  if (res.status === 401) {
    signOut();
    window.location.href = "/login";
  }

  return res;
};
