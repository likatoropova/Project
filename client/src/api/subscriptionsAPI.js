import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const getSubscriptions = async () => {
  try {
    console.log('GETTING SUBSCRIPTIONS');
    
    const response = await axiosInstance.get(API_ENDPOINTS.SUBSCRIPTIONS);
    
    console.log('SUBSCRIPTIONS RECEIVED:', response.data);
    
    if (response.data?.success && response.data?.data) {
      return { success: true, data: response.data.data };
    }
    
    return { success: false, data: [] };
  } catch (error) {
    console.error('ERROR GETTING SUBSCRIPTIONS:', error.response?.data);
    
    return { 
      success: false, 
      error: error.response?.data || { message: 'Ошибка получения подписок' },
      data: [] 
    };
  }
};