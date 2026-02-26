import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, refreshToken } from '../api/authAPI';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasPersonalData, setHasPersonalData] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');
      const firstTestPassed = localStorage.getItem('firstTestPassed') === 'true';
      
      if (token && savedUser) {
        try {
          const refreshTokenValue = localStorage.getItem('refreshToken');
          if (refreshTokenValue) {
            await refreshToken(refreshTokenValue);
          }
          
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          setHasPersonalData(firstTestPassed);
        } catch (error) {
            console.error('Ошибка при проверке авторизации:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      const firstTestPassed = localStorage.getItem('firstTestPassed') === 'true';
      setHasPersonalData(firstTestPassed);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Ошибка входа' };
    }
  };

  const completeFirstTest = () => {
    setHasPersonalData(true);
    localStorage.setItem('firstTestPassed', 'true');
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setIsAuthenticated(false);
    setHasPersonalData(false);
    localStorage.removeItem('firstTestPassed');
  };

  const value = {
    user,
    isAuthenticated,
    hasPersonalData,
    loading,
    login,
    logout,
    completeFirstTest
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};