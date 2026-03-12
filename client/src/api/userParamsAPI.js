import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

// Сохранить цель тренировок (шаг 1)
export const saveGoal = async (goalId) => {
  try {
    console.log('📝 SAVING GOAL - Step 1:', { goal_id: goalId });
    
    // При первом запросе бэкенд создаст guest_id и сохранит в Redis
    const response = await axiosInstance.post(API_ENDPOINTS.SAVE_GOAL, {
      goal_id: parseInt(goalId)
    });
    
    console.log('✅ GOAL SAVED - Response:', response.data);
    
    // Сохраняем guest_id из ответа API в localStorage
    if (response.data?.data?.guest_id) {
      localStorage.setItem('guestId', response.data.data.guest_id);
      console.log('💾 Guest ID saved to localStorage:', response.data.data.guest_id);
    }
    
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
    
    const payload = {
      level_id: parseInt(levelId)
    };

    
    console.log('📦 Payload:', payload);
    
    const response = await axiosInstance.post(API_ENDPOINTS.SAVE_LEVEL, payload);
    
    console.log('✅ LEVEL SAVED - Response:', response.data);
    
    // НЕ удаляем guest_id здесь! Он понадобится при регистрации
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ ERROR SAVING LEVEL:', error.response?.data);
    return { 
      success: false, 
      error: error.response?.data || { message: 'Ошибка сохранения уровня' } 
    };
  }
};