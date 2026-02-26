import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const saveGoal = async (goalId) => {
  try {
    console.log('Saving goal:', { goal_id: goalId });
    const response = await axiosInstance.post(API_ENDPOINTS.SAVE_GOAL, {
      goal_id: goalId
    });
    console.log('Goal saved:', response.data);
    if (response.data.data?.guest_id) {
      localStorage.setItem('guestId', response.data.data.guest_id);
    }
    return response.data;
  } catch (error) {
    console.error('Error saving goal:', error.response?.data);
    throw error.response?.data || { message: 'Ошибка сохранения цели' };
  }
};

export const saveAnthropometry = async (data) => {
  try {
    console.log('Saving anthropometry:', data);
    const guestId = localStorage.getItem('guestId');
    const payload = {
      gender: data.gender,
      age: parseInt(data.age),
      weight: parseFloat(data.weight),
      height: parseInt(data.height),
      equipment_id: data.equipment_id
    };
    if (guestId) {
      payload.guest_id = guestId;
    }
    const response = await axiosInstance.post(API_ENDPOINTS.SAVE_ANTHROPOMETRY, payload);
    console.log('Anthropometry saved:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving anthropometry:', error.response?.data);
    throw error.response?.data || { message: 'Ошибка сохранения антропометрии' };
  }
};

export const saveLevel = async (levelId) => {
  try {
    console.log('📝 Saving level:', { level_id: levelId });
    const guestId = localStorage.getItem('guestId');
    const payload = {
      level_id: levelId
    };
    if (guestId) {
      payload.guest_id = guestId;
    }
    const response = await axiosInstance.post(API_ENDPOINTS.SAVE_LEVEL, payload);
    console.log('Level saved:', response.data);
    localStorage.removeItem('guestId');
    
    return response.data;
  } catch (error) {
    console.error('Error saving level:', error.response?.data);
    throw error.response?.data || { message: 'Ошибка сохранения уровня' };
  }
};

export const getUserParams = async () => {
  try {
    console.log('Getting user parameters');
    
    const response = await axiosInstance.get(API_ENDPOINTS.GET_USER_PARAMS);
    
    console.log('User params received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting user params:', error.response?.data);
    
    // Если 404 - это нормально, значит данных нет
    if (error.response?.status === 404) {
      return { success: false, data: null };
    }
    
    throw error.response?.data || { message: 'Ошибка получения параметров' };
  }
};