import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const useSubscriptionDetails = (id) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscriptionDetails = useCallback(async () => {
    if (!id) {
      setError('ID подписки не указан');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching subscription details for ID: ${id}`);
      const response = await axiosInstance.get(API_ENDPOINTS.SUBSCRIPTION_DETAILS(id));
      console.log('Subscription details received:', response.data);
      
      if (response.data?.success && response.data?.data) {
        setSubscription(response.data.data);
      } else {
        setSubscription(null);
        setError('Не удалось загрузить информацию о подписке');
      }
    } catch (err) {
      console.error('Error fetching subscription details:', err);
      
      if (err.response?.status === 404) {
        setError('Подписка не найдена');
      } else {
        setError(err.response?.data?.message || 'Не удалось загрузить информацию о подписке');
      }
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSubscriptionDetails();
  }, [fetchSubscriptionDetails]);

  // Безопасное преобразование в число
  const safeParseInt = (value) => {
    if (value === null || value === undefined) return 0;
    const parsed = parseInt(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return `${price} ₽`;
    
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  const getDurationText = (days) => {
    if (days === 30) return 'месяц';
    if (days === 90) return 'месяца';
    if (days === 180) return 'месяцев';
    if (days === 365) return 'месяцев';
    return `${days} дней`;
  };

  const getNumberPart = (days) => {
    if (days === 30) return '1';
    if (days === 90) return '3';
    if (days === 180) return '6';
    if (days === 365) return '12';
    return days;
  };

  return {
    subscription,
    loading,
    error,
    fetchSubscriptionDetails,
    formatPrice,
    getDurationText,
    getNumberPart
  };
};