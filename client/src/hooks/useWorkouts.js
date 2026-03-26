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
      
      if (response.data?.success && response.data?.data) {
        // Проверяем, что data содержит нужные поля
        setAllAssigned(response.data.data.assigned || []);
        setAllStarted(response.data.data.started || []);
      } else if (response.data?.success && !response.data?.data) {
        // Если data пустой, устанавливаем пустые массивы
        console.log('ℹ️ No workouts data, setting empty arrays');
        setAllAssigned([]);
        setAllStarted([]);
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