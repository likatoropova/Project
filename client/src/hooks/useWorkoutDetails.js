import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const useWorkoutDetails = (userWorkoutId) => {
  const [workoutData, setWorkoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkoutDetails = useCallback(async () => {
    if (!userWorkoutId) {
      setError('ID тренировки не указан');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`📥 Fetching workout details for ID: ${userWorkoutId}`);
      const response = await axiosInstance.get(API_ENDPOINTS.WORKOUT_EXECUTION(userWorkoutId));
      console.log('✅ Workout details received:', response.data);
      
      if (response.data?.success && response.data?.data) {
        setWorkoutData(response.data.data);
      } else {
        setWorkoutData(null);
        setError('Не удалось загрузить информацию о тренировке');
      }
    } catch (err) {
      console.error('❌ Error fetching workout details:', err);
      
      if (err.response?.status === 404) {
        setError('Тренировка не найдена');
      } else {
        setError(err.response?.data?.message || 'Не удалось загрузить тренировку');
      }
      setWorkoutData(null);
    } finally {
      setLoading(false);
    }
  }, [userWorkoutId]);

  useEffect(() => {
    fetchWorkoutDetails();
  }, [fetchWorkoutDetails]);

  // Форматирование длительности
  const formatDuration = (minutes) => {
    if (!minutes) return '';
    return `(${minutes} минут)`;
  };

  // Форматирование времени в минутах/секундах
  const formatTime = (seconds) => {
    if (!seconds) return '';
    if (seconds < 60) return `${seconds} сек`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins} мин ${secs} сек` : `${mins} минут`;
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
    workoutData,
    loading,
    error,
    fetchWorkoutDetails,
    formatDuration,
    formatTime,
    getWorkoutType
  };
};