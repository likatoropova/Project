import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const processSubscriptionPayment = async (paymentData) => {
  try {
    console.log('Processing subscription payment:', {
      subscription_id: paymentData.subscription_id,
      save_card: paymentData.save_card,
      use_saved_card: paymentData.use_saved_card
    });

    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENT_SUBSCRIPTION, {
      subscription_id: paymentData.subscription_id,
      save_card: paymentData.save_card,
      use_saved_card: paymentData.use_saved_card,
      card_number: paymentData.card_number,
      card_holder: paymentData.card_holder,
      expiry_month: paymentData.expiry_month,
      expiry_year: paymentData.expiry_year,
      cvv: paymentData.cvv
    });

    console.log('Payment processed:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Payment error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data || { message: 'Ошибка при оплате' } 
    };
  }
};