import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RequireFirstTest = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, hasPersonalData, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (hasPersonalData) {
        navigate('/');
      }
    }
  }, [isAuthenticated, hasPersonalData, loading, navigate]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated || hasPersonalData) {
    return null;
  }

  return children;
};

export default RequireFirstTest;