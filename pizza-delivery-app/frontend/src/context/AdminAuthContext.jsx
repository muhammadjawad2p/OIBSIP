import React, { createContext, useContext, useState, useEffect } from "react";
import { adminAuthService } from "../services/authService";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("adminAccessToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await adminAuthService.getMe();
        setAdmin(data.admin);
      } catch {
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (credentials) => {
    const { data } = await adminAuthService.login(credentials);
    localStorage.setItem("adminAccessToken", data.accessToken);
    localStorage.setItem("adminRefreshToken", data.refreshToken);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
