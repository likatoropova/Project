// src/api/admin/warmupsAPI.js

import axiosInstance from '../axiosConfig';

const ADMIN_WARMUPS_URL = '/admin/warmups';

// Получить список разминок
export const getWarmups = async (params = {}) => {
    try {
        const response = await axiosInstance.get(ADMIN_WARMUPS_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching warmups:', error);
        throw error.response?.data || { message: 'Ошибка загрузки разминок' };
    }
};

// Получить разминку по ID
export const getWarmupById = async (id) => {
    try {
        const response = await axiosInstance.get(`${ADMIN_WARMUPS_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching warmup:', error);
        throw error.response?.data || { message: 'Ошибка загрузки разминки' };
    }
};

// Создать разминку
export const createWarmup = async (data) => {
    try {

        console.log('createWarmup called with:', data instanceof FormData ? 'FormData' : typeof data);

        const response = await axiosInstance.post(ADMIN_WARMUPS_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating warmup:', error);
        throw error.response?.data || { message: 'Ошибка создания разминки' };
    }
};

// Обновить разминку
export const updateWarmup = async (id, data) => {
    try {
        const config =  {}

        // Для PUT с FormData используем POST + _method, как у вас уже реализовано
        const response = data instanceof FormData
            ? await axiosInstance.post(`${ADMIN_WARMUPS_URL}/${id}?_method=PUT`, data, config)
            : await axiosInstance.put(`${ADMIN_WARMUPS_URL}/${id}`, data, config);

        return response.data;
    } catch (error) {
        console.error('Error updating warmup:', error);
        throw error.response?.data || { message: 'Ошибка обновления разминки' };
    }
};

// Удалить разминку
export const deleteWarmup = async (id) => {
    try {
        const response = await axiosInstance.delete(`${ADMIN_WARMUPS_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting warmup:', error);
        throw error.response?.data || { message: 'Ошибка удаления разминки' };
    }
};

// Загрузить изображение разминки
export const uploadWarmupImage = async (id, file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axiosInstance.post(
            `${ADMIN_WARMUPS_URL}/${id}/image`,
            formData
        );
        return response.data;
    } catch (error) {
        console.error('Error uploading warmup image:', error);
        throw error.response?.data || { message: 'Ошибка загрузки изображения' };
    }
};