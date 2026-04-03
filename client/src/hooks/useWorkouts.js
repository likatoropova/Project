import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const useWorkouts = () => {
  const [allAssigned, setAllAssigned] = useState([]);
  const [allStarted, setAllStarted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Fetching workouts...');
      const response = await axiosInstance.get(API_ENDPOINTS.WORKOUTS);
      console.log('✅ Workouts received:', response.data);
      
      if (response.data?.success) {
        // Проверяем структуру данных
        const data = response.data.data || {};
        
        // Безопасно устанавливаем массивы
        setAllAssigned(Array.isArray(data.assigned) ? data.assigned : []);
        setAllStarted(Array.isArray(data.started) ? data.started : []);
        
        console.log('📊 Assigned workouts:', allAssigned.length);
        console.log('📊 Started workouts:', allStarted.length);
      } else {
        console.warn('Unexpected response format:', response.data);
        setAllAssigned([]);
        setAllStarted([]);
        setError('Неверный формат данных от сервера');
      }
    } catch (err) {
      console.error('❌ Error fetching workouts:', err);
      setError(err.response?.data?.message || 'Не удалось загрузить тренировки');
      setAllAssigned([]);
      setAllStarted([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  // Форматирование длительности
  const formatDuration = (minutes) => {
    if (!minutes) return '';
    return `(${minutes} минут)`;
  };

  // Получение типа тренировки на русском
  const getWorkoutType = (type) => {
    const types = {
      'strength': 'Силовой тренинг',
      'cardio': 'Кардио',
      'flexibility': 'Растяжка',
      'warmup': 'Разминка',
      'default': 'Тренировка'
    };
    return types[type] || types.default;
  };

  return {
    allAssigned,
    allStarted,
    loading,
    error,
    fetchWorkouts,
    formatDuration,
    getWorkoutType
  };
};

export default useWorkouts;