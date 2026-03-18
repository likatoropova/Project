import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosConfig';

export const useSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubscriptions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get('/subscriptions');
            
            if (response.data?.success && Array.isArray(response.data?.data)) {
                setSubscriptions(response.data.data);
            } else if (Array.isArray(response.data)) {
                setSubscriptions(response.data);
            } else {
                console.warn('Unexpected response format:', response.data);
                setSubscriptions([]);
                setError('Неверный формат данных от сервера');
            }
        } catch (err) {
            console.error('Error fetching subscriptions:', err);
            setError(err.response?.data?.message || 'Не удалось загрузить подписки');
            setSubscriptions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubscriptions();
    }, [fetchSubscriptions]);

    // Форматирование цены
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

    // Форматирование длительности
    const formatDuration = (days) => {
        const numDays = parseInt(days);
        if (numDays === 30) return 'месяц';
        if (numDays === 90) return 'месяца';
        if (numDays === 180) return 'месяцев';
        if (numDays === 365) return 'месяцев';
        return `${numDays} дней`;
    };

    return {
        subscriptions,
        loading,
        error,
        fetchSubscriptions,
        formatPrice,
        formatDuration
    };
};