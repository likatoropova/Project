import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RequireFirstTest = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, hasCompletedFirstTest, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      console.log('🔍 RequireFirstTest check:', { 
        isAuthenticated, 
        hasCompletedFirstTest 
      });
      
      if (!isAuthenticated) {
        console.log('➡️ Not authenticated, redirecting to login');
        navigate('/login');
      } else if (hasCompletedFirstTest) {
        console.log('➡️ Test already completed, redirecting to home');
        navigate('/');
      } else {
        console.log('✅ Showing test page');
      }
    }
  }, [isAuthenticated, hasCompletedFirstTest, loading, navigate]);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!isAuthenticated || hasCompletedFirstTest) {
    return null;
  }

  return children;
};

export default RequireFirstTest;