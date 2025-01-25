import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser, logout } from "../services/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
  }, []);

  const handleLogout = () => {
    logout();
    navigator.navigate("/login");
    
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;