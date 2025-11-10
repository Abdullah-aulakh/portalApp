import useAxios from "@/hooks/useAxios";
import { div } from "framer-motion/client";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { response, loading, error, fetchData } = useAxios();

  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    fetchData({ url: "users/profile", method: "get" });
  }, []);

  useEffect(() => {
    if (response) {
      const userData = response?.user || response;
      setUser(userData);
    }
    if (!loading) {
      setInitialized(true);
    }
  }, [response, loading, error]);

  if (!initialized) return;

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
