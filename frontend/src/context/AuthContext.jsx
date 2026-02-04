"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, signOut } from "@/lib/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const data = await fetchMe();
      setUser(data);
    } catch (err) {
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
