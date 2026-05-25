"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, getUser, isAuthenticated, signOut } from "@/lib/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    setLoading(true);

    try {
      const localUser = getUser();

      if (!isAuthenticated() || !localUser) {
        setUser(null);
        return;
      }

      setUser(localUser);

      const freshUser = await fetchMe();
      setUser(freshUser);

    } catch (err) {
      console.warn("Session expired");
      signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    const listener = () => loadUser();
    window.addEventListener("auth-changed", listener);

    return () => {
      window.removeEventListener("auth-changed", listener);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);