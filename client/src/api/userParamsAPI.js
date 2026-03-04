import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

// Сохранить цель тренировок (шаг 1)
export const saveGoal = async (goalId) => {
  try {
    console.log('📝 SAVING GOAL - Step 1:', { goal_id: goalId });
    
    const response = await axiosInstance.post(API_ENDPOINTS.SAVE_GOAL, {
      goal_id: parseInt(goalId)
    });
    
    console.log('✅ GOAL SAVED - Response:', response.data);
    console.log('🔑 Guest ID will be set by backend via cookies/headers');
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ ERROR SAVING GOAL:', error.response?.data);
    return { 
      success: false, 
      error: error.response?.data || { message: 'Ошибка сохранения цели' } 
    };
  }
};

// Сохранить антропометрические данные (шаг 2)
export const saveAnthropometry = async (data) => {
  try {
    console.log('📝 SAVING ANTHROPOMETRY - Step 2:', data);
    
    const payload = {
      gender: data.gender,
      age: parseInt(data.age),
      weight: parseFloat(data.weight),
      height: parseInt(data.height),
      equipment_id: parseInt(data.equipment_id)
    };
    
    const response = await axiosInstance.post(API_ENDPOINTS.SAVE_ANTHROPOMETRY, payload);
    console.log('✅ ANTHROPOMETRY SAVED - Response:', response.data);
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ ERROR SAVING ANTHROPOMETRY:', error.response?.data);
    return { 
      success: false, 
      error: error.response?.data || { message: 'Ошибка сохранения антропометрии' } 
    };
  }
};

// Сохранить уровень подготовки (шаг 3)
export const saveLevel = async (levelId) => {
  try {
    console.log('📝 SAVING LEVEL - Step 3:', { level_id: levelId });
    
    const response = await axiosInstance.post(API_ENDPOINTS.SAVE_LEVEL, {
      level_id: parseInt(levelId)
    });
    
    console.log('✅ LEVEL SAVED - Response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ ERROR SAVING LEVEL:', error.response?.data);
    return { 
      success: false, 
      error: error.response?.data || { message: 'Ошибка сохранения уровня' } 
    };
  }
};

// ПОЛУЧИТЬ ПАРАМЕТРЫ АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ
export const getUserParams = async () => {
  try {
    console.log('📝 GETTING USER PARAMS');
    
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.log('❌ No token, user not authenticated');
      return { success: false, data: null };
    }
    
    const response = await axiosInstance.get(API_ENDPOINTS.GET_USER_PARAMS);
    console.log('✅ USER PARAMS RECEIVED:', response.data);
    
    if (response.data?.data && Object.keys(response.data.data).length > 0) {
      return { success: true, data: response.data.data };
    }
    
    return { success: false, data: null };
    
  } catch (error) {
    console.error('❌ ERROR GETTING USER PARAMS:', error.response?.data);
    
    if (error.response?.status === 404) {
      return { success: false, data: null };
    }
    
    return { 
      success: false, 
      error: error.response?.data || { message: 'Ошибка получения параметров' },
      data: null 
    };
  }
};