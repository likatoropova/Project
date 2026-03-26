// src/api/admin/tagsAPI.js

import axiosInstance from '../axiosConfig';

const ADMIN_TAGS_URL = '/admin/categories';

// Получить список тегов (с пагинацией и поиском)
export const getTags = async (params = {}) => {
    try {
        const response = await axiosInstance.get(ADMIN_TAGS_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching tags:', error);
        throw error.response?.data || { message: 'Ошибка загрузки тегов' };
    }
};

// Создать новый тег
export const createTag = async (data) => {
    try {
        const response = await axiosInstance.post(ADMIN_TAGS_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating tag:', error);
        throw error.response?.data || { message: 'Ошибка создания тега' };
    }
};

// Обновить тег
export const updateTag = async (id, data) => {
    try {
        const response = await axiosInstance.put(`${ADMIN_TAGS_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating tag:', error);
        throw error.response?.data || { message: 'Ошибка обновления тега' };
    }
};

// Удалить тег
export const deleteTag = async (id) => {
    try {
        const response = await axiosInstance.delete(`${ADMIN_TAGS_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting tag:', error);
        throw error.response?.data || { message: 'Ошибка удаления тега' };
    }
};