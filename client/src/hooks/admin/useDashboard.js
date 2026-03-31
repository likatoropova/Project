// src/hooks/admin/useDashboard.js

import { useState, useEffect, useCallback } from 'react';
import {
    getOverview,
    getRevenueByMonth,
    getSubscriptionsCount,
    getSubscriptionsByPeriod
} from '../../api/admin/dashboardAPI';
import { getTests } from '../../api/admin/testsAPI';
import { getWorkouts } from '../../api/admin/workoutsAPI';
import { useApi } from '../useApi';

export const useDashboard = () => {
    const [overview, setOverview] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [subscriptionsCountData, setSubscriptionsCountData] = useState([]);
    const [subscriptionsPeriodData, setSubscriptionsPeriodData] = useState([]);
    const [latestTests, setLatestTests] = useState([]);
    const [latestWorkouts, setLatestWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('revenue');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedPeriod, setSelectedPeriod] = useState(12);
    const [error, setError] = useState(null);

    const { execute: executeGetOverview } = useApi(getOverview);
    const { execute: executeGetRevenue } = useApi(getRevenueByMonth);
    const { execute: executeGetSubscriptionsCount } = useApi(getSubscriptionsCount);
    const { execute: executeGetSubscriptionsPeriod } = useApi(getSubscriptionsByPeriod);
    const { execute: executeGetTests } = useApi(getTests);
    const { execute: executeGetWorkouts } = useApi(getWorkouts);

    // Загрузка общей статистики
    const fetchOverview = useCallback(async () => {
        const response = await executeGetOverview();
        if (response.success && response.data) {
            setOverview(response.data);
        }
    }, [executeGetOverview]);

    // Загрузка выручки по месяцам
    const fetchRevenue = useCallback(async () => {
        const response = await executeGetRevenue(selectedYear);
        console.log('Revenue response:', response); // Для отладки

        if (response.success && response.data) {
            // Данные могут быть в response.data.data или response.data.data.data
            let dataArray = [];
            if (response.data.data && Array.isArray(response.data.data)) {
                dataArray = response.data.data;
            } else if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
                dataArray = response.data.data.data;
            } else if (Array.isArray(response.data)) {
                dataArray = response.data;
            }

            console.log('Revenue data array:', dataArray); // Для отладки
            setRevenueData(dataArray);
        } else {
            setRevenueData([]);
        }
    }, [selectedYear, executeGetRevenue]);

    // Загрузка количества подписок по месяцам
    const fetchSubscriptionsCount = useCallback(async () => {
        const response = await executeGetSubscriptionsCount(selectedYear);
        console.log('Subscriptions count response:', response); // Для отладки

        if (response.success && response.data) {
            let dataArray = [];
            if (response.data.data && Array.isArray(response.data.data)) {
                dataArray = response.data.data;
            } else if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
                dataArray = response.data.data.data;
            } else if (Array.isArray(response.data)) {
                dataArray = response.data;
            }

            console.log('Subscriptions count data array:', dataArray);
            setSubscriptionsCountData(dataArray);
        } else {
            setSubscriptionsCountData([]);
        }
    }, [selectedYear, executeGetSubscriptionsCount]);

    // Загрузка подписок по периодам
    const fetchSubscriptionsPeriod = useCallback(async () => {
        const response = await executeGetSubscriptionsPeriod(selectedPeriod);
        console.log('Subscriptions period response:', response); // Для отладки

        if (response.success && response.data) {
            let dataArray = [];
            if (response.data.data && Array.isArray(response.data.data)) {
                dataArray = response.data.data;
            } else if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
                dataArray = response.data.data.data;
            } else if (Array.isArray(response.data)) {
                dataArray = response.data;
            }

            console.log('Subscriptions period data array:', dataArray);
            setSubscriptionsPeriodData(dataArray);
        } else {
            setSubscriptionsPeriodData([]);
        }
    }, [selectedPeriod, executeGetSubscriptionsPeriod]);

    // Загрузка последних тестов
    const fetchLatestTests = useCallback(async () => {
        try {
            const response = await executeGetTests({ per_page: 2 });

            if (response.success && response.data) {
                let tests = [];
                if (response.data.data && Array.isArray(response.data.data)) {
                    tests = response.data.data;
                } else if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
                    tests = response.data.data.data;
                } else if (Array.isArray(response.data)) {
                    tests = response.data;
                }

                setLatestTests(tests);
            } else {
                setLatestTests([]);
            }
        } catch (error) {
            console.error('Error fetching latest tests:', error);
            setLatestTests([]);
        }
    }, [executeGetTests]);

    // Загрузка последних тренировок
    const fetchLatestWorkouts = useCallback(async () => {
        try {
            const response = await executeGetWorkouts({ per_page: 2 });

            if (response.success && response.data) {
                let workouts = [];
                if (response.data.data && Array.isArray(response.data.data)) {
                    workouts = response.data.data;
                } else if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
                    workouts = response.data.data.data;
                } else if (Array.isArray(response.data)) {
                    workouts = response.data;
                }

                setLatestWorkouts(workouts);
            } else {
                setLatestWorkouts([]);
            }
        } catch (error) {
            console.error('Error fetching latest workouts:', error);
            setLatestWorkouts([]);
        }
    }, [executeGetWorkouts]);

    // Загрузка всех данных
    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            await Promise.all([
                fetchOverview(),
                fetchRevenue(),
                fetchSubscriptionsCount(),
                fetchSubscriptionsPeriod(),
                fetchLatestTests(),
                fetchLatestWorkouts()
            ]);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    }, [fetchOverview, fetchRevenue, fetchSubscriptionsCount, fetchSubscriptionsPeriod, fetchLatestTests, fetchLatestWorkouts]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // Обновление данных при изменении типа графика
    useEffect(() => {
        if (chartType === 'revenue') {
            fetchRevenue();
        } else if (chartType === 'count') {
            fetchSubscriptionsCount();
        } else if (chartType === 'period') {
            fetchSubscriptionsPeriod();
        }
    }, [chartType, selectedYear, selectedPeriod, fetchRevenue, fetchSubscriptionsCount, fetchSubscriptionsPeriod]);

    const handleChartTypeChange = (type) => {
        setChartType(type);
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
    };

    const formatCurrency = (value) => {
        if (value === undefined || value === null) return '0 ₽';
        return `${value.toLocaleString()} ₽`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    // Получение данных для текущего графика
    const getCurrentChartData = () => {
        if (chartType === 'revenue') {
            return Array.isArray(revenueData) ? revenueData : [];
        }
        if (chartType === 'count') {
            return Array.isArray(subscriptionsCountData) ? subscriptionsCountData : [];
        }
        return Array.isArray(subscriptionsPeriodData) ? subscriptionsPeriodData : [];
    };

    // Получение названия для графика
    const getChartTitle = () => {
        if (chartType === 'revenue') return 'Статистика выручки';
        if (chartType === 'count') return `Количество подписок по месяцам (${selectedYear} г.)`;
        return `Количество подписок за последние ${selectedPeriod} месяцев`;
    };

    return {
        overview,
        latestTests,
        latestWorkouts,
        loading,
        error,
        chartType,
        selectedYear,
        selectedPeriod,
        revenueData,
        subscriptionsCountData,
        subscriptionsPeriodData,
        getCurrentChartData,
        getChartTitle,
        handleChartTypeChange,
        handleYearChange,
        handlePeriodChange,
        formatCurrency,
        formatDate
    };
};