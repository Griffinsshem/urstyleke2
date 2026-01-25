export const signIn = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event("auth-changed"));
};

export const signOut = () => {
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("auth-changed"));
};

export const getUser = () => {
  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem("user"));
};
