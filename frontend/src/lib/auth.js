import { API_URL } from "@/lib/api";

// Browser sessions live in httpOnly cookies set by the API, so JavaScript never sees a token.
// All that is kept here is a non-secret copy of the user (for instant UI) and the CSRF cookies
// the API deliberately leaves readable so they can be echoed back in a header.

const USER_KEY = "urstyleke_user";
const LEGACY_TOKEN_KEYS = ["urstyleke_access_token", "urstyleke_refresh_token"];
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const hasWindow = () => typeof window !== "undefined";

// Tokens used to live in localStorage. Remove any an older version left behind.
if (hasWindow()) {
  try {
    LEGACY_TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    // storage unavailable; nothing to clean
  }
}

const readCookie = (name) => {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const match = document.cookie.split("; ").find((c) => c.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
};

const notifyAuthChanged = () => window.dispatchEvent(new Event("auth-changed"));

export const getUser = () => {
  if (!hasWindow()) return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// A hint for the UI only. The server decides who is really signed in.
export const isAuthenticated = () => !!getUser();

const setSession = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthChanged();
};

// Same-origin request to the API. Unsafe methods carry the CSRF header taken from its cookie.
const send = (path, options = {}, csrfCookie = "csrf_access_token") => {
  const method = (options.method || "GET").toUpperCase();
  const headers = {
    ...(options.body && { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (!SAFE_METHODS.has(method)) {
    const csrf = readCookie(csrfCookie);
    if (csrf) headers["X-CSRF-TOKEN"] = csrf;
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    method,
    headers,
    credentials: "same-origin",
  });
};

const apiError = (data, fallback) => {
  const err = new Error(data.error || fallback);
  err.code = data.code;
  err.retryAfter = data.retry_after;
  return err;
};

export const signOut = () => {
  // Best effort: the server revokes the session and clears the httpOnly cookies.
  // Signing out in the browser never waits for it.
  send("/auth/logout", { method: "POST", keepalive: true }, "csrf_refresh_token").catch(() => {});

  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    // storage unavailable; nothing to clear
  }
  notifyAuthChanged();
};

export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw apiError(data, "Registration failed");

  return data;
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Auth-Mode": "cookie" },
    credentials: "same-origin",
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw apiError(data, "Login failed");

  const user = { id: data.user_id, email: data.email };

  setSession(user);

  return user;
};

// One refresh at a time, however many requests hit an expired session together.
let refreshInFlight = null;

const refreshSession = () => {
  if (!refreshInFlight) {
    refreshInFlight = send("/auth/refresh", { method: "POST" }, "csrf_refresh_token")
      .then((res) => {
        if (!res.ok) throw new Error("Refresh failed");
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
};

// Authenticated request: on 401 refresh the session once and retry once.
export const authFetch = async (path, options = {}) => {
  let res = await send(path, options);

  if (res.status === 401) {
    try {
      await refreshSession();
    } catch (err) {
      signOut();
      throw err;
    }

    res = await send(path, options);
  }

  return res;
};

export const fetchMe = async () => {
  const res = await authFetch("/auth/me");

  if (!res.ok) throw new Error("Unauthorized");

  return res.json();
};
