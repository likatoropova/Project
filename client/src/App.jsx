import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { requestForToken, onMessageListener } from './firebase';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FirstTestProvider } from './context/FirstTestContext';
import { GuestTestProvider } from './context/GuestTestContext';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterCode from './pages/RegisterCode';
import ForgotPassword from './pages/ForgotPassword';
import RestorePassword from './pages/RestorePassword';
import ConfirmPassword from './pages/ConfirmPassword';
import TestsPage from './pages/TestsPage';
import TestChoice from './pages/TestChoicePage';
import TestPlan from './pages/TestPlanPage';
import TestExercisePage from './pages/TestExercisePage';
import TrainingGoal from './pages/TrainingGoal';
import TrainingPersonalParam from './pages/TrainingPersonalParam';
import TrainingLevel from './pages/TrainingLevel';
import HomePage from './pages/HomePage';
import Subscriptions from './pages/Subscriptions';
import SubscriptionDetails from './pages/SubscriptionDetails';
import ConsentPage from './pages/ConsentPage';
import PrivacyPage from './pages/PrivacyPage';
import OfferPage from './pages/OfferPage';
import TrainingsPage from './pages/TrainingsPage';
import WorkoutDetailsPage from './pages/WorkoutDetailsPage';

import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTags from './pages/admin/AdminTags';
import AdminTests from './pages/admin/AdminTests';
import TestForm from './pages/admin/TestForm';
import TestExercises from './pages/admin/TestExercises';
import TestingExerciseForm from './pages/admin/TestingExerciseForm';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import SubscriptionForm from './pages/admin/SubscriptionForm';
import AdminExercises from './pages/admin/AdminExercises';
import ExerciseForm from './pages/admin/ExerciseForm';
import AdminWarmups from './pages/admin/AdminWarmups';
import WarmupForm from './pages/admin/WarmupForm';


function App() {
  const [notification, setNotification] = useState({ title: '', body: '' });

  useEffect(() => {
    // Настраиваем FCM только если пользователь авторизован
    const setupFCM = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; // Не отправляем токен, если пользователь не авторизован

      try {
        const fcmToken = await requestForToken();
        if (fcmToken) {
          // Отправляем токен на Laravel API
          await axios.post('/api/save-token', {
            fcm_token: fcmToken,
            device_type: 'web',
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('FCM token sent to backend');
        }
      } catch (error) {
        console.error('Failed to setup FCM', error);
      }
    };

    setupFCM();

    // Слушаем уведомления, когда приложение активно
    const messageListener = onMessageListener();

    messageListener.then((payload) => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body
      });
      console.log('Foreground message received:', payload);

      // Автоматически скрываем уведомление через 5 секунд
      setTimeout(() => {
        setNotification({ title: '', body: '' });
      }, 5000);
    }).catch(err => console.log('FCM listening failed: ', err));

    // Очищаем слушатель при размонтировании компонента
    return () => {
      // Здесь можно добавить логику для отписки, если это необходимо
      // В текущей реализации onMessageListener не возвращает функцию отписки
    };
  }, []);

  const NotificationPopup = ({ title, body }) => {
    if (!title && !body) return null;

    return (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 9999
        }}>
          <h4 style={{ margin: '0 0 8px 0' }}>{title}</h4>
          <p style={{ margin: 0 }}>{body}</p>
        </div>
    );
  };

  return (
    <Router>
      <AuthProvider>
        <FirstTestProvider>
          <GuestTestProvider>
          <NotificationPopup title={notification.title} body={notification.body} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-code" element={<RegisterCode />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/restore-password" element={<RestorePassword />} />
            <Route path="/confirm-password" element={<ConfirmPassword />} />
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/test/:id" element={<TestChoice />} />
            <Route path="/test-plan" element={<TestPlan />} />
            <Route path="/test-exercise/:testId/:exerciseId" element={<TestExercisePage />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/subscriptions/:id" element={<SubscriptionDetails />} />
            <Route path="/training-goal" element={<TrainingGoal />} />
            <Route path="/training-personal-param" element={<TrainingPersonalParam />} />
            <Route path="/training-level" element={<TrainingLevel />} />
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/offer" element={<OfferPage />} />
            <Route path="/trainings" element={<TrainingsPage />} />
            <Route path="/workout-details/:userWorkoutId" element={<WorkoutDetailsPage />} />

            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin/tests/create" element={<TestForm />} />
              <Route path="/admin/tests/edit/:id" element={<TestForm />} />
              <Route path="/admin/tests/:id/exercises" element={<TestExercises />} />
              <Route path="/admin/testing-exercises/create" element={<TestingExerciseForm />} />
              <Route path="/admin/testing-exercises/edit/:id" element={<TestingExerciseForm />} />
              <Route path="/admin/subscriptions/create" element={<SubscriptionForm />} />
              <Route path="/admin/subscriptions/edit/:id" element={<SubscriptionForm />} />
              <Route path="/admin/exercises/create" element={<ExerciseForm />} />
              <Route path="/admin/exercises/edit/:id" element={<ExerciseForm />} />
              <Route path="/admin/warmups/create" element={<WarmupForm />} />
              <Route path="/admin/warmups/edit/:id" element={<WarmupForm />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                {/*<Route path="workouts" element={<AdminWorkouts />} />*/}
                <Route path="tests" element={<AdminTests />} />
                <Route path="tests/:id/exercises" element={<TestExercises />} />
                <Route path="subscriptions" element={<AdminSubscriptions />} />
                <Route path="tags" element={<AdminTags />} />
                <Route path="exercises" element={<AdminExercises />} />
                <Route path="warmups" element={<AdminWarmups />} />
              </Route>
            </Route>

          </Routes>
          </GuestTestProvider>
        </FirstTestProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;