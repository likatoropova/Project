import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

// 2. АВТОРИЗАЦИЯ (Вход)
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
      email,
      password
    });
    
    // Сохраняем токены и данные пользователя
    const { accessToken, refreshToken, user } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка авторизации' };
  }
};

// 3. РЕГИСТРАЦИЯ
export const register = async (email, name, password) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, {
      email,
      name,
      password
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка регистрации' };
  }
};

// 4. ВЫХОД
export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    await axiosInstance.post(API_ENDPOINTS.LOGOUT, { refreshToken });
  } catch (error) {
    console.error('Ошибка при выходе:', error);
  } finally {
    // Всегда очищаем локальные данные
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

// 5. ОБНОВЛЕНИЕ ТОКЕНА
export const refreshToken = async (refreshTokenValue) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken: refreshTokenValue
    });
    
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка обновления токена' };
  }
};

// 6. ПОДТВЕРЖДЕНИЕ EMAIL ЧЕРЕЗ КОД
export const verifyEmail = async (email,code) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.VERIFY_CODE, {
      email,
      code
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка подтверждения email' };
  }
};

export const resendVerificationCode = async (email) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.RESEND_CODE, {
      email
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка повторной отправки кода' };
  }
};

// 7. ЗАПРОС НА ВОССТАНОВЛЕНИЕ ПАРОЛЯ
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, {
      email
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка запроса восстановления' };
  }
};

// 8. ПОДТВЕРЖДЕНИЕ КОДА СБРОСА ПАРОЛЯ
export const verifyResetCode = async (email, code) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, {
      email,
      code
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Неверный код подтверждения' };
  }
};

// 9. СБРОС ПАРОЛЯ
export const resetPassword = async (email, code, password, password_confirmation) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.CHANGE_PASSWORD, {
      email,
      code,
      password,
      password_confirmation
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка сброса пароля' };
  }
};