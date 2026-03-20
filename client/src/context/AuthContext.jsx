import React, { createContext, useState, useEffect, useCallback } from "react";
import { login as apiLogin, logout as apiLogout } from "../api/authAPI";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Ошибка при загрузке пользователя:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Callbacks registered by guest contexts to clean up in-memory state on login/logout
  const guestCleanupCallbacks = React.useRef([]);

  const registerGuestCleanup = useCallback((fn) => {
    guestCleanupCallbacks.current.push(fn);
    return () => {
      guestCleanupCallbacks.current = guestCleanupCallbacks.current.filter(
        (cb) => cb !== fn,
      );
    };
  }, []);

  const runGuestCleanup = () => {
    guestCleanupCallbacks.current.forEach((fn) => fn());
  };

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      // Clear in-memory guest state now that the guest data has been
      // transferred to the authenticated user by the API call above.
      runGuestCleanup();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || "Ошибка входа" };
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setIsAuthenticated(false);
    // Also wipe any lingering in-memory guest state
    runGuestCleanup();
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    registerGuestCleanup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
