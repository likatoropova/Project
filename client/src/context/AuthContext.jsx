import React, { createContext, useState, useEffect, useCallback } from "react";
import { login as apiLogin, logout as apiLogout } from "../api/authAPI";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [hasUserParams, setHasUserParams] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const checkIsAdmin = (userData) => {
    return userData?.role_id === 1;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);

          setHasUserParams(!!userData?.user_params);
          setIsAdmin(userData?.role === 'admin' || userData?.role === 'admin' || userData?.is_admin === true);

          console.log('User loaded:', userData);
          console.log('Is admin:', checkIsAdmin(userData));

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
      console.log('Login response FULL:', data);
      const userData = data.user || data.data?.user || data;

      if (!userData) {
        console.error('No user data found in response');
        return { success: false, error: 'Не удалось получить данные пользователя' };
      }

      setUser(data.user);
      setIsAuthenticated(true);

      setHasUserParams(!!data.user?.user_params);
      setIsAdmin(checkIsAdmin(userData));

      console.log('Is admin after login:', checkIsAdmin(userData));

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

    setHasUserParams(false);
    setIsAdmin(false);

    // Also wipe any lingering in-memory guest state
    runGuestCleanup();
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    hasUserParams,
    isAdmin,
    login,
    logout,
    registerGuestCleanup,
  };

  console.log('AuthContext value updated:', { isAuthenticated, isAdmin, loading });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
