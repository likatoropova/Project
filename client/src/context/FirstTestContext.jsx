import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Создаем контекст
const FirstTestContext = createContext(null);

// Хук для использования контекста
export const useFirstTest = () => {
  const context = useContext(FirstTestContext);
  if (!context) {
    throw new Error('useFirstTest must be used within FirstTestProvider');
  }
  return context;
};

// Провайдер контекста
export const FirstTestProvider = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, hasUserParams } = useAuth();
  const [guestId, setGuestId] = useState(null);
  const [hasGuestParams, setHasGuestParams] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const navigationInProgress = useRef(false);

  useEffect(() => {
    const savedGuestId = localStorage.getItem('guestId');
    const guestParamsCompleted = localStorage.getItem('guestParamsCompleted') === 'true';
    
    if (savedGuestId) {
      console.log('🆔 Found existing guest ID:', savedGuestId);
      setGuestId(savedGuestId);
      setHasGuestParams(guestParamsCompleted);
    }
  }, []);

  useEffect(() => {
    if (navigationInProgress.current) return;
    if (initialCheckDone) return;

    console.log('🔍 Initial guest check:', {
      isAuthenticated,
      hasUserParams,
      hasGuestParams,
      guestId,
      path: window.location.pathname
    });

    if (isAuthenticated && hasUserParams) {
      if (window.location.pathname !== '/') {
        console.log('➡️ Authenticated user with params, redirecting to home');
        navigationInProgress.current = true;
        navigate('/');
        setTimeout(() => { navigationInProgress.current = false; }, 500);
      }
      setInitialCheckDone(true);
      return;
    }

    if (!isAuthenticated && !hasGuestParams) {
      const isOnTestPage = [
        '/training-goal',
        '/training-personal-param',
        '/training-level'
      ].includes(window.location.pathname);
      
      if (!isOnTestPage) {
        console.log('➡️ Guest without params, redirecting to training goal');
        navigationInProgress.current = true;
        navigate('/training-goal');
        setTimeout(() => { navigationInProgress.current = false; }, 500);
      }
    }

    setInitialCheckDone(true);
  }, [isAuthenticated, hasUserParams, hasGuestParams, guestId, initialCheckDone, navigate]);

  const setGuestIdFromApi = (id) => {
    console.log('🆔 Setting guest ID from API:', id);
    setGuestId(id);
    localStorage.setItem('guestId', id);
  };

  const completeGuestTest = () => {
    console.log('✅ Guest test completed');
    setHasGuestParams(true);
    localStorage.setItem('guestParamsCompleted', 'true');
    navigationInProgress.current = false;
  };

  const resetGuest = () => {
    console.log('🔄 Resetting guest data');
    setGuestId(null);
    setHasGuestParams(false);
    localStorage.removeItem('guestId');
    localStorage.removeItem('guestParamsCompleted');
    setInitialCheckDone(false);
    navigationInProgress.current = false;
  };

  const value = {
    guestId,
    hasGuestParams,
    setGuestIdFromApi,
    completeGuestTest,
    resetGuest
  };

  return (
    <FirstTestContext.Provider value={value}>
      {children}
    </FirstTestContext.Provider>
  );
};

export default FirstTestContext;