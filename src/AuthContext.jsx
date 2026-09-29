// AuthContext.js
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

function readStoredAuth() {
  try {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const raw = localStorage.getItem("auth");
    if (!isAuthenticated || !raw) {
      return { isAuthenticated: false, auth: null };
    }
    const auth = JSON.parse(raw);
    if (!auth || typeof auth !== "object") {
      return { isAuthenticated: false, auth: null };
    }
    return { isAuthenticated: true, auth };
  } catch {
    return { isAuthenticated: false, auth: null };
  }
}

export const AuthProvider = ({ children }) => {
  const stored = readStoredAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(stored.isAuthenticated);
  const [auth, setAuth] = useState(stored.auth);

  const login = (userData) => {
    setIsAuthenticated(true);
    setAuth(userData);
    localStorage.setItem("auth", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuth(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
