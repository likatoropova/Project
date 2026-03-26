// src/api/admin/subscriptionsAPI.js

import axiosInstance from '../axiosConfig';

const ADMIN_SUBSCRIPTIONS_URL = '/admin/subscriptions';

// Получить список подписок
export const getSubscriptions = async (params = {}) => {
    try {
        const response = await axiosInstance.get(ADMIN_SUBSCRIPTIONS_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        throw error.response?.data || { message: 'Ошибка загрузки подписок' };
    }
};

// Получить подписку по ID
export const getSubscriptionById = async (id) => {
    try {
        const response = await axiosInstance.get(`${ADMIN_SUBSCRIPTIONS_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching subscription:', error);
        throw error.response?.data || { message: 'Ошибка загрузки подписки' };
    }
};

// Создать подписку
export const createSubscription = async (data) => {
    try {
        const response = await axiosInstance.post(ADMIN_SUBSCRIPTIONS_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw error.response?.data || { message: 'Ошибка создания подписки' };
    }
};

// Обновить подписку
export const updateSubscription = async (id, data) => {
    try {
        const response = await axiosInstance.put(`${ADMIN_SUBSCRIPTIONS_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating subscription:', error);
        throw error.response?.data || { message: 'Ошибка обновления подписки' };
    }
};

// Удалить подписку
export const deleteSubscription = async (id) => {
    try {
        const response = await axiosInstance.delete(`${ADMIN_SUBSCRIPTIONS_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting subscription:', error);
        throw error.response?.data || { message: 'Ошибка удаления подписки' };
    }
};

// Загрузить изображение подписки
export const uploadSubscriptionImage = async (id, file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axiosInstance.post(`${ADMIN_SUBSCRIPTIONS_URL}/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading subscription image:', error);
        throw error.response?.data || { message: 'Ошибка загрузки изображения' };
    }
};