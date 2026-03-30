// src/api/admin/workoutsAPI.js

import axiosInstance from '../axiosConfig';

const ADMIN_WORKOUTS_URL = '/admin/workouts';

// Получить список тренировок
export const getWorkouts = async (params = {}) => {
    try {
        const response = await axiosInstance.get(ADMIN_WORKOUTS_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching workouts:', error);
        throw error.response?.data || { message: 'Ошибка загрузки тренировок' };
    }
};

// Получить тренировку по ID
export const getWorkoutById = async (id) => {
    try {
        const response = await axiosInstance.get(`${ADMIN_WORKOUTS_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching workout:', error);
        throw error.response?.data || { message: 'Ошибка загрузки тренировки' };
    }
};

// Создать тренировку
export const createWorkout = async (data) => {
    try {
        let response;

        if (data instanceof FormData) {
            response = await axiosInstance.post(ADMIN_WORKOUTS_URL, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else {
            response = await axiosInstance.post(ADMIN_WORKOUTS_URL, data);
        }

        return response.data;
    } catch (error) {
        console.error('Error creating workout:', error);
        throw error.response?.data || { message: 'Ошибка создания тренировки' };
    }
};

// Обновить тренировку
export const updateWorkout = async (id, data) => {
    try {
        let response;

        if (data instanceof FormData) {
            response = await axiosInstance.post(`${ADMIN_WORKOUTS_URL}/${id}?_method=PUT`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else {
            response = await axiosInstance.put(`${ADMIN_WORKOUTS_URL}/${id}`, data);
        }

        return response.data;
    } catch (error) {
        console.error('Error updating workout:', error);
        throw error.response?.data || { message: 'Ошибка обновления тренировки' };
    }
};

// Удалить тренировку
export const deleteWorkout = async (id) => {
    try {
        const response = await axiosInstance.delete(`${ADMIN_WORKOUTS_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting workout:', error);
        throw error.response?.data || { message: 'Ошибка удаления тренировки' };
    }
};

// Загрузить изображение тренировки
export const uploadWorkoutImage = async (id, file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axiosInstance.post(`${ADMIN_WORKOUTS_URL}/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading workout image:', error);
        throw error.response?.data || { message: 'Ошибка загрузки изображения' };
    }
};

// Получить список фаз (уровней)
export const getPhases = async () => {
    try {
        const response = await axiosInstance.get('/admin/phases');
        return response.data;
    } catch (error) {
        console.error('Error fetching phases:', error);
        throw error.response?.data || { message: 'Ошибка загрузки фаз' };
    }
};