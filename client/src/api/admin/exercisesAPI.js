// src/api/admin/exercisesAPI.js

import axiosInstance from '../axiosConfig';

const ADMIN_EXERCISES_URL = '/admin/exercises';

// Получить список упражнений
export const getExercises = async (params = {}) => {
    try {
        const response = await axiosInstance.get(ADMIN_EXERCISES_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching exercises:', error);
        throw error.response?.data || { message: 'Ошибка загрузки упражнений' };
    }
};

// Получить упражнение по ID
export const getExerciseById = async (id) => {
    try {
        const response = await axiosInstance.get(`${ADMIN_EXERCISES_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching exercise:', error);
        throw error.response?.data || { message: 'Ошибка загрузки упражнения' };
    }
};

// Создать упражнение
export const createExercise = async (data) => {
    try {
        let response;

        if (data instanceof FormData) {
            response = await axiosInstance.post(ADMIN_EXERCISES_URL, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else {
            response = await axiosInstance.post(ADMIN_EXERCISES_URL, data);
        }

        return response.data;
    } catch (error) {
        console.error('Error creating exercise:', error);
        throw error.response?.data || { message: 'Ошибка создания упражнения' };
    }
};

// Обновить упражнение
export const updateExercise = async (id, data) => {
    try {
        let response;

        if (data instanceof FormData) {
            response = await axiosInstance.post(`${ADMIN_EXERCISES_URL}/${id}?_method=PUT`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else {
            response = await axiosInstance.put(`${ADMIN_EXERCISES_URL}/${id}`, data);
        }

        return response.data;
    } catch (error) {
        console.error('Error updating exercise:', error);
        throw error.response?.data || { message: 'Ошибка обновления упражнения' };
    }
};

// Удалить упражнение
export const deleteExercise = async (id) => {
    try {
        const response = await axiosInstance.delete(`${ADMIN_EXERCISES_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting exercise:', error);
        throw error.response?.data || { message: 'Ошибка удаления упражнения' };
    }
};

// Загрузить изображение упражнения
export const uploadExerciseImage = async (id, file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axiosInstance.post(`${ADMIN_EXERCISES_URL}/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading exercise image:', error);
        throw error.response?.data || { message: 'Ошибка загрузки изображения' };
    }
};

// Получить список оборудования
export const getEquipment = async () => {
    try {
        const response = await axiosInstance.get('/admin/equipment');
        return response.data;
    } catch (error) {
        console.error('Error fetching equipment:', error);
        throw error.response?.data || { message: 'Ошибка загрузки оборудования' };
    }
};