// src/lib/auth.js

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
