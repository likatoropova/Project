// client/src/hooks/useSubscriptions.js

import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import axiosInstance from '../api/axiosConfig';

export const useSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);

    const { execute: fetchSubscriptions, loading, error } = useApi(async () => {
        const response = await axiosInstance.get('/subscriptions');
        return response.data;
    });

    const loadSubscriptions = useCallback(async () => {
        const result = await fetchSubscriptions();
        if (result.success && result.data) {
            const subscriptionsData = result.data.data || [];
            setSubscriptions(subscriptionsData);
        }
    }, []);

    useEffect(() => {
        loadSubscriptions();
    }, []);

    // Форматирование цены
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Форматирование длительности
    const formatDuration = (days) => {
        if (days === 30) return 'месяц';
        if (days === 90) return '3 месяца';
        if (days === 180) return '6 месяцев';
        if (days === 365) return 'год';
        return `${days} дней`;
    };

    return {
        subscriptions,
        loading,
        error,
        loadSubscriptions,
        formatPrice,
        formatDuration
    };
};