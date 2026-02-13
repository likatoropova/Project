// hooks/useApi.js
import { useState } from 'react';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Executing API function:', apiFunction.name, args);
      
      const response = await apiFunction(...args);
      setData(response);
      
      return { success: true, data: response };
    } catch (err) {
      console.error('API hook error:', err);
      
      const errorMessage = err.message || 'Произошла ошибка';
      setError(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage,
        originalError: err 
      };
    } finally {
      setLoading(false);
    }
  };

  return { execute, data, loading, error };
};