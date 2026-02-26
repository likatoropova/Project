import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireFirstTest from './components/RequireFirstTest';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterCode from './pages/RegisterCode';
import ForgotPassword from './pages/ForgotPassword';
import RestorePassword from './pages/RestorePassword';
import ConfirmPassword from './pages/ConfirmPassword';

function App() {
  // const [notification, setNotification] = useState({ title: '', body: '' });
  //
  // useEffect(() => {
  //   // Настраиваем FCM только если пользователь авторизован
  //   const setupFCM = async () => {
  //     const token = localStorage.getItem('token');
  //     if (!token) return; // Не отправляем токен, если пользователь не авторизован
  //
  //     try {
  //       const fcmToken = await requestForToken();
  //       if (fcmToken) {
  //         // Отправляем токен на Laravel API
  //         await axios.post('/api/save-token', {
  //           fcm_token: fcmToken,
  //           device_type: 'web',
  //         }, {
  //           headers: { Authorization: `Bearer ${token}` }
  //         });
  //         console.log('FCM token sent to backend');
  //       }
  //     } catch (error) {
  //       console.error('Failed to setup FCM', error);
  //     }
  //   };
  //
  //   setupFCM();
  //
  //   // Слушаем уведомления, когда приложение активно
  //   const unsubscribe = onMessageListener()
  //       .then((payload) => {
  //         setNotification({
  //           title: payload.notification.title,
  //           body: payload.notification.body
  //         });
  //         console.log('Foreground message received:', payload);
  //
  //         // Автоматически скрываем уведомление через 5 секунд
  //         setTimeout(() => {
  //           setNotification({ title: '', body: '' });
  //         }, 5000);
  //       })
  //       .catch(err => console.log('FCM listening failed: ', err));
  //
  //   // Очищаем слушатель при размонтировании компонента
  //   return () => {
  //     // Если onMessageListener возвращает функцию отписки, вызываем её здесь
  //   };
  // }, []); // Пустой массив зависимостей, чтобы эффект сработал только один раз

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-code" element={<RegisterCode />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/restore-password" element={<RestorePassword />} />
          <Route path="/confirm-password" element={<ConfirmPassword />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;