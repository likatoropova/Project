import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

// Сохранить цель тренировок (шаг 1)
export const saveGoal = async (goalId) => {
  try {
    console.log('📝 SAVING GOAL - Step 1:', { goal_id: goalId });
    
    const token = localStorage.getItem('accessToken');
    console.log('🔑 Token present:', !!token);
    
    const response = await axiosInstance.post(API_ENDPOINTS.SAVE_GOAL, {
      goal_id: parseInt(goalId)
    });
    
    console.log('✅ GOAL SAVED - Full response:', response);
    console.log('✅ GOAL SAVED - Response data:', response.data);
    console.log('✅ GOAL SAVED - Response status:', response.status);
    
    // Сохраняем guest_id если он есть (для неавторизованного пользователя)
    if (response.data?.data?.guest_id) {
      console.log('💾 Guest ID received from API:', response.data.data.guest_id);
      localStorage.setItem('guestId', response.data.data.guest_id);
    } else {
      console.log('⚠️ No guest_id in response');
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ ERROR SAVING GOAL - Full error:', error);
    console.error('❌ ERROR SAVING GOAL - Response:', error.response);
    console.error('❌ ERROR SAVING GOAL - Response data:', error.response?.data);
    console.error('❌ ERROR SAVING GOAL - Status:', error.response?.status);
    
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
    
    const guestId = localStorage.getItem('guestId');
    
    const payload = {
      gender: data.gender,
      age: parseInt(data.age),
      weight: parseFloat(data.weight),
      height: parseInt(data.height),
      equipment_id: parseInt(data.equipment_id)
    };
    
    if (guestId) {
      payload.guest_id = guestId;
      console.log('➕ Adding guest_id to payload:', guestId);
    }
    
    console.log('📦 Payload:', payload);
    
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
    
    const guestId = localStorage.getItem('guestId');
    
    const payload = {
      level_id: parseInt(levelId)
    };
    
    if (guestId) {
      payload.guest_id = guestId;
      console.log('➕ Adding guest_id to payload:', guestId);
    }
    
    console.log('📦 Payload:', payload);
    
    const response = await axiosInstance.post(API_ENDPOINTS.SAVE_LEVEL, payload);
    
    console.log('✅ LEVEL SAVED - Response:', response.data);
    
    // Не очищаем guestId, он может понадобиться при регистрации
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
      console.log('📊 User has parameters in DB');
      return { success: true, data: response.data.data };
    }
    
    console.log('❌ No parameters found for user');
    return { success: false, data: null };
    
  } catch (error) {
    console.error('❌ ERROR GETTING USER PARAMS:', error.response?.data);
    
    if (error.response?.status === 404) {
      console.log('ℹ️ User has no parameters (404)');
      return { success: false, data: null };
    }
    
    return { 
      success: false, 
      error: error.response?.data || { message: 'Ошибка получения параметров' },
      data: null 
    };
  }
};