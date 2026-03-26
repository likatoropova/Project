// src/api/admin/testingExercisesAPI.js

import axiosInstance from '../axiosConfig';

const ADMIN_TESTING_EXERCISES_URL = '/admin/testing-exercises';

// Получить список тестовых упражнений
export const getTestingExercises = async (params = {}) => {
    try {
        const response = await axiosInstance.get(ADMIN_TESTING_EXERCISES_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching testing exercises:', error);
        throw error.response?.data || { message: 'Ошибка загрузки упражнений' };
    }
};

// Получить упражнение по ID
export const getTestingExerciseById = async (id) => {
    try {
        const response = await axiosInstance.get(`${ADMIN_TESTING_EXERCISES_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching testing exercise:', error);
        throw error.response?.data || { message: 'Ошибка загрузки упражнения' };
    }
};

// Создать тестовое упражнение
export const createTestingExercise = async (data) => {
    try {
        const response = await axiosInstance.post(ADMIN_TESTING_EXERCISES_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating testing exercise:', error);
        throw error.response?.data || { message: 'Ошибка создания упражнения' };
    }
};

// Обновить тестовое упражнение
export const updateTestingExercise = async (id, data) => {
    try {
        const response = await axiosInstance.put(`${ADMIN_TESTING_EXERCISES_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating testing exercise:', error);
        throw error.response?.data || { message: 'Ошибка обновления упражнения' };
    }
};

// Удалить тестовое упражнение
export const deleteTestingExercise = async (id) => {
    try {
        const response = await axiosInstance.delete(`${ADMIN_TESTING_EXERCISES_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting testing exercise:', error);
        throw error.response?.data || { message: 'Ошибка удаления упражнения' };
    }
};

// Привязать упражнения к тесту
export const attachExercisesToTest = async (testId, exerciseIds) => {
    try {
        const response = await axiosInstance.post(`/admin/testing-exercises`, {
            exercise_ids: exerciseIds
        });
        return response.data;
    } catch (error) {
        console.error('Error attaching exercises to test:', error);
        throw error.response?.data || { message: 'Ошибка привязки упражнений' };
    }
};

export const uploadTestingExerciseImage = async (id, file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axiosInstance.post(`/admin/testing-exercises/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading testing exercise image:', error);
        throw error.response?.data || { message: 'Ошибка загрузки изображения' };
    }
};

// Получить упражнения теста
export const getTestExercises = async (testId) => {
    try {
        const response = await axiosInstance.get(`/admin/testings/${testId}/exercises`);
        return response.data;
    } catch (error) {
        console.error('Error fetching test exercises:', error);
        throw error.response?.data || { message: 'Ошибка загрузки упражнений теста' };
    }
};

// Удалить упражнение из теста
export const removeExerciseFromTest = async (testId, exerciseId) => {
    try {
        const response = await axiosInstance.delete(`/admin/testings/${testId}/exercises/${exerciseId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing exercise from test:', error);
        throw error.response?.data || { message: 'Ошибка удаления упражнения из теста' };
    }
};