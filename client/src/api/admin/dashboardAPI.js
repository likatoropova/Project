// src/api/admin/dashboardAPI.js

import axiosInstance from '../axiosConfig';

// Получить общую статистику
export const getOverview = async () => {
    try {
        const response = await axiosInstance.get('/admin/overview');
        return response.data;
    } catch (error) {
        console.error('Error fetching overview:', error);
        throw error.response?.data || { message: 'Ошибка загрузки статистики' };
    }
};

// Получить выручку по месяцам
export const getRevenueByMonth = async (year = 2026) => {
    try {
        const response = await axiosInstance.get('/admin/revenue', { params: { year } });
        return response.data;
    } catch (error) {
        console.error('Error fetching revenue:', error);
        throw error.response?.data || { message: 'Ошибка загрузки данных о выручке' };
    }
};

// Получить количество подписок по месяцам
export const getSubscriptionsCount = async (year = 2026) => {
    try {
        const response = await axiosInstance.get('/admin/subscriptions/count', { params: { year } });
        return response.data;
    } catch (error) {
        console.error('Error fetching subscriptions count:', error);
        throw error.response?.data || { message: 'Ошибка загрузки количества подписок' };
    }
};

// Получить подписки по периодам
export const getSubscriptionsByPeriod = async (period = 12) => {
    try {
        const response = await axiosInstance.get('/admin/subscriptions/period', { params: { period } });
        return response.data;
    } catch (error) {
        console.error('Error fetching subscriptions by period:', error);
        throw error.response?.data || { message: 'Ошибка загрузки подписок по периодам' };
    }
};