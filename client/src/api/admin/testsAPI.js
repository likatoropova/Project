// src/api/admin/testsAPI.js

import axiosInstance from '../axiosConfig';

const ADMIN_TESTS_URL = '/admin/testings';
const ADMIN_TESTING_EXERCISES_URL = '/admin/testing-exercises';

// Получить список тестов
export const getTests = async (params = {}) => {
    try {
        const response = await axiosInstance.get(ADMIN_TESTS_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching tests:', error);
        throw error.response?.data || { message: 'Ошибка загрузки тестов' };
    }
};

// Получить тест по ID
export const getTestById = async (id) => {
    try {
        const response = await axiosInstance.get(`${ADMIN_TESTS_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching test:', error);
        throw error.response?.data || { message: 'Ошибка загрузки теста' };
    }
};

// Создать тест
export const createTest = async (data) => {
    try {
        const response = await axiosInstance.post(ADMIN_TESTS_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating test:', error);
        throw error.response?.data || { message: 'Ошибка создания теста' };
    }
};

export const uploadTestImage = async (id, file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axiosInstance.post(
            `${ADMIN_TESTS_URL}/${id}/image`,
            formData
        );
        return response.data;
    } catch (error) {
        console.error('Error uploading test image:', error);
        throw error.response?.data || { message: 'Ошибка загрузки изображения' };
    }
};

// Обновить тест
export const updateTest = async (id, data) => {
    try {
        const response = data instanceof FormData
            ? await axiosInstance.post(`${ADMIN_TESTS_URL}/${id}?_method=PUT`, data)
            : await axiosInstance.put(`${ADMIN_TESTS_URL}/${id}`, data);

        return response.data;
    } catch (error) {
        console.error('Error updating test:', error);
        throw error.response?.data || { message: 'Ошибка обновления теста' };
    }
};

// Удалить тест
export const deleteTest = async (id) => {
    try {
        const response = await axiosInstance.delete(`${ADMIN_TESTS_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting test:', error);
        throw error.response?.data || { message: 'Ошибка удаления теста' };
    }
};

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
        const response = await axiosInstance.post(`/admin/testings/${testId}/exercises`, {
            exercise_ids: exerciseIds
        });
        return response.data;
    } catch (error) {
        console.error('Error attaching exercises to test:', error);
        throw error.response?.data || { message: 'Ошибка привязки упражнений' };
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