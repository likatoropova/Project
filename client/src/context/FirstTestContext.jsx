import React, { createContext, useState, useContext } from 'react';
import axiosInstance from '../api/axiosConfig';

const FirstTestContext = createContext();

export const useGuestTest = () => {
  const context = useContext(FirstTestContext);
  if (!context) {
    throw new Error('useGuestTest must be used within GuestTestProvider');
  }
  return context;
};

export const FirstTestProvider = ({ children }) => {
  const [guestId, setGuestId] = useState(null);
  const [guestData, setGuestData] = useState({
    goal: null,
    anthropometry: null,
    level: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Получить или создать guest ID при первом заходе на страницы теста
  const initializeGuest = async () => {
    try {
      setLoading(true);
      
      // Проверяем, есть ли уже guest_id в localStorage
      let existingGuestId = localStorage.getItem('guestId');
      
      if (!existingGuestId) {
        // Если нет, запрашиваем у сервера
        console.log('🆕 Requesting new guest ID from server...');
        
        // Сервер создаст guest_id через middleware или отдельный эндпоинт
        // Мы просто делаем запрос к любому эндпоинту, сервер вернет заголовок
        const response = await axiosInstance.get('/user-parameters/me', {
          headers: {
            'X-Guest-ID': existingGuestId || ''
          }
        });
        
        // Получаем guest_id из заголовка ответа
        const newGuestId = response.headers['x-guest-id'];
        
        if (newGuestId) {
          existingGuestId = newGuestId;
          localStorage.setItem('guestId', existingGuestId);
          console.log('✅ Guest ID obtained:', existingGuestId);
        }
      } else {
        console.log('🔍 Existing guest ID found:', existingGuestId);
      }
      
      setGuestId(existingGuestId);
      
      // Загружаем сохраненные данные гостя из localStorage
      const savedGoal = localStorage.getItem('guest_goal');
      const savedAnthropometry = localStorage.getItem('guest_anthropometry');
      const savedLevel = localStorage.getItem('guest_level');
      
      setGuestData({
        goal: savedGoal ? JSON.parse(savedGoal) : null,
        anthropometry: savedAnthropometry ? JSON.parse(savedAnthropometry) : null,
        level: savedLevel ? JSON.parse(savedLevel) : null
      });
      
    } catch (err) {
      console.error('❌ Error initializing guest:', err);
      setError('Ошибка при инициализации гостя');
    } finally {
      setLoading(false);
    }
  };

  // Сохранить цель гостя
  const saveGuestGoal = (goalId) => {
    const goalData = { goal_id: goalId };
    localStorage.setItem('guest_goal', JSON.stringify(goalData));
    setGuestData(prev => ({ ...prev, goal: goalData }));
    console.log('💾 Guest goal saved locally:', goalData);
  };

  // Сохранить антропометрию гостя
  const saveGuestAnthropometry = (data) => {
    const anthropometryData = {
      gender: data.gender,
      age: data.age,
      weight: data.weight,
      height: data.height,
      equipment_id: data.equipment_id
    };
    localStorage.setItem('guest_anthropometry', JSON.stringify(anthropometryData));
    setGuestData(prev => ({ ...prev, anthropometry: anthropometryData }));
    console.log('💾 Guest anthropometry saved locally:', anthropometryData);
  };

  // Сохранить уровень гостя
  const saveGuestLevel = (levelId) => {
    const levelData = { level_id: levelId };
    localStorage.setItem('guest_level', JSON.stringify(levelData));
    setGuestData(prev => ({ ...prev, level: levelData }));
    console.log('💾 Guest level saved locally:', levelData);
  };

  // Очистить данные гостя (после регистрации/авторизации)
  const clearGuestData = () => {
    localStorage.removeItem('guestId');
    localStorage.removeItem('guest_goal');
    localStorage.removeItem('guest_anthropometry');
    localStorage.removeItem('guest_level');
    setGuestId(null);
    setGuestData({
      goal: null,
      anthropometry: null,
      level: null
    });
    console.log('🧹 Guest data cleared');
  };

  // Проверить, завершил ли гость все шаги
  const isGuestTestComplete = () => {
    return !!(guestData.goal && guestData.anthropometry && guestData.level);
  };

  const value = {
    guestId,
    guestData,
    loading,
    error,
    initializeGuest,
    saveGuestGoal,
    saveGuestAnthropometry,
    saveGuestLevel,
    clearGuestData,
    isGuestTestComplete
  };

  return (
    <FirstTestContext.Provider value={value}>
      {children}
    </FirstTestContext.Provider>
  );
};