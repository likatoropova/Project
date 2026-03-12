// client/src/hooks/useTestPlan.js

import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import axiosInstance from '../api/axiosConfig';

export const useTestPlan = () => {
    const [tests, setTests] = useState([]);

    // Загрузка данных с API
    const { execute: fetchTests, loading, error } = useApi(async () => {
        const response = await axiosInstance.get('/testings');
        return response.data;
    });

    // Загрузка тестов
    const loadTests = useCallback(async () => {
        const result = await fetchTests();
        if (result.success && result.data) {
            const testsData = result.data.data || [];
            // Берем только первые 2 теста
            setTests(testsData.slice(0, 2));
        }
    }, []);

    // Загружаем тесты при монтировании
    useEffect(() => {
        loadTests();
    }, []);

    // Форматирование длительности
    const formatDuration = useCallback((duration) => {
        if (!duration) return '';
        if (typeof duration === 'string') return duration;
        return `${duration} минут`;
    }, []);

    return {
        tests,
        loading,
        error,
        loadTests,
        formatDuration
    };
};