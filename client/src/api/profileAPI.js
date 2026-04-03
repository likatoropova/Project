import axiosInstance from "./axiosConfig";

// Получить полный профиль
export const getProfile = async () => {
    try {
        const response = await axiosInstance.get('/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка получения профиля" };
    }
};

// Обновить профиль (имя и email)
export const updateProfile = async (data) => {
    try {
        const response = await axiosInstance.put('/profile', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка обновления профиля" };
    }
};

// Сменить пароль
export const changePassword = async (data) => {
    try {
        const response = await axiosInstance.post('/profile/change-password', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка смены пароля" };
    }
};

// Загрузить аватар
export const uploadAvatar = async (file) => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await axiosInstance.post('/profile/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка загрузки аватара" };
    }
};

// Удалить аккаунт
export const deleteAccount = async () => {
    try {
        const response = await axiosInstance.delete('/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка удаления аккаунта" };
    }
};

// Получить статистику по объему
export const getVolumeStatistics = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/profile/statistics/volume', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка получения статистики объема" };
    }
};

// Получить статистику по тренду
export const getTrendStatistics = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/profile/statistics/trend', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка получения статистики тренда" };
    }
};

// Получить статистику по частоте
export const getFrequencyStatistics = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/profile/statistics/frequency', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка получения статистики частоты" };
    }
};

// Отменить подписку
export const cancelSubscription = async (subscriptionId) => {
    try {
        const response = await axiosInstance.post(`/subscriptions/${subscriptionId}/cancel`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка отмены подписки" };
    }
};

// Продлить подписку
export const renewSubscription = async (subscriptionId) => {
    try {
        const response = await axiosInstance.post(`/subscriptions/${subscriptionId}/renew`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка продления подписки" };
    }
};

// Получить параметры пользователя
export const getUserParameters = async () => {
    try {
        const response = await axiosInstance.get('/user-parameters/me');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка получения параметров" };
    }
};

// Обновить параметры пользователя
export const updateUserParameters = async (data) => {
    try {
        const response = await axiosInstance.put('/user-parameters', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка обновления параметров" };
    }
};

// Получить список целей
export const getGoals = async () => {
    try {
        const response = await axiosInstance.get('/goals');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка получения целей" };
    }
};

// Получить список уровней
export const getLevels = async () => {
    try {
        const response = await axiosInstance.get('/levels');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка получения уровней" };
    }
};

// Получить список оборудования
export const getEquipment = async () => {
    try {
        const response = await axiosInstance.get('/equipment');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Ошибка получения оборудования" };
    }
};