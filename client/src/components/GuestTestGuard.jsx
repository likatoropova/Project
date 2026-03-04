import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGuestTest } from '../context/FirstTestContext';
import axiosInstance from '../api/axiosConfig';

const GuestTestGuard = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { guestId, initializeGuest, loading } = useGuestTest();

  useEffect(() => {
    const checkUserParams = async () => {
      // Если пользователь авторизован - проверяем его параметры
      if (isAuthenticated) {
        try {
          console.log('🔍 Checking authenticated user params...');
          const response = await axiosInstance.get('/user-parameters/me');
          
          if (response.data?.data && Object.keys(response.data.data).length > 0) {
            console.log('✅ User has parameters, staying on site');
            // У пользователя есть параметры - остаемся на сайте
          } else {
            console.log('❌ User has no parameters, but this should not happen');
            // Здесь можно показать ошибку или что-то еще
          }
        } catch (error) {
          console.log('❌ Error checking user params:', error);
        }
        return;
      }

      // Если пользователь не авторизован - инициализируем гостя
      if (!isAuthenticated && !guestId && !loading) {
        console.log('🔄 Unauthorized user, initializing guest...');
        await initializeGuest();
      }
    };

    checkUserParams();
  }, [isAuthenticated, guestId, loading, initializeGuest]);

  // Если гость не инициализирован и не грузится - показываем загрузку
  if (!isAuthenticated && !guestId && loading) {
    return <div>Инициализация гостя...</div>;
  }

  return children;
};

export default GuestTestGuard;