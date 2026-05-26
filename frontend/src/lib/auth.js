const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ACCESS_KEY = "urstyleke_access_token";
const REFRESH_KEY = "urstyleke_refresh_token";
const USER_KEY = "urstyleke_user";


export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(ACCESS_KEY);
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
};

export const getUser = () => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};


export const setSession = (accessToken, refreshToken, user) => {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  window.dispatchEvent(new Event("auth-changed"));
};

export const signOut = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);

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

  const user = {
    id: data.user_id,
    email: data.email,
  };

  setSession(data.access_token, data.refresh_token, user);

  return user;
};

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    signOut();
    throw new Error("Refresh failed");
  }

  localStorage.setItem(ACCESS_KEY, data.access_token);

  return data.access_token;
};

export const authFetch = async (url, options = {}) => {
  let token = getToken();

  const headers = {
    ...(options.body && { "Content-Type": "application/json" }),
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  let res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    try {
      token = await refreshAccessToken();

      headers.Authorization = `Bearer ${token}`;

      res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
      });
    } catch (err) {
      signOut();
      throw err;
    }
  }

  return res;
};

export const fetchMe = async () => {
  const res = await authFetch("/auth/me");

  if (!res.ok) throw new Error("Unauthorized");

  return res.json();
};