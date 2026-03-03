import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/authAPI';
import { getUserParams } from '../api/userParamsAPI';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasUserParams, setHasUserParams] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkUserParams = useCallback(async () => {
    try {
      console.log('🔍 Checking if user has parameters via API...');
      const response = await getUserParams();
      console.log('📊 User params check result:', response);
      
      // Если есть данные и запрос успешен - у пользователя есть параметры
      if (response?.success && response?.data) {
        console.log('✅ User has parameters in DB');
        setHasUserParams(true);
        return true;
      } else {
        console.log('❌ User has NO parameters in DB');
        setHasUserParams(false);
        return false;
      }
    } catch (error) {
      console.log('❌ Error checking params:', error);
      setHasUserParams(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');
      
      console.log('🔍 Auth check - token present:', !!token);
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Проверяем наличие параметров через API
          await checkUserParams();
          
        } catch (error) {
          console.error('Ошибка при загрузке пользователя:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [checkUserParams]);

  const login = async (email, password) => {
    try {
      console.log('🔑 Logging in...');
      const data = await apiLogin(email, password);
      console.log('✅ Login response:', data);
      
      setUser(data.user);
      setIsAuthenticated(true);
      
      // Проверяем наличие параметров через API
      await checkUserParams();
      
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message || 'Ошибка входа' };
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setIsAuthenticated(false);
    setHasUserParams(false);
  };

  // Функция для обновления статуса после успешного сохранения параметров
  const refreshParamsStatus = useCallback(async () => {
    await checkUserParams();
  }, [checkUserParams]);

  const value = {
    user,
    isAuthenticated,
    hasUserParams,
    loading,
    login,
    logout,
    refreshParamsStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};