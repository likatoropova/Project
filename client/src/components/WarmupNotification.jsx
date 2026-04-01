import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { startWarmup } from '../api/workoutAPI';
import '../styles/notification.css';

const WarmupNotification = ({ userWorkoutId, duration = 8000, onClose }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const handleClose = useCallback(() => {
    if (isClosing || loading) return;

    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  }, [isClosing, loading, onClose]);

  // Автоматически скрываем через duration мс
  useEffect(() => {
    if (duration && duration > 0) {
      timerRef.current = setTimeout(handleClose, duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [duration, handleClose]);

  // Клик по уведомлению — вызываем start-warmup и переходим на страницу разминки
  const handleClick = async () => {
    if (loading) return;

    // Останавливаем таймер автоскрытия — иначе закроется пока идёт запрос
    if (timerRef.current) clearTimeout(timerRef.current);

    setLoading(true);

    try {
      console.log('📤 Starting warmup from notification for userWorkout:', userWorkoutId);
      const response = await startWarmup(userWorkoutId);

      console.log('✅ Warmup start response:', response);

      if (response?.success) {
        const { warmup } = response.data;
        // Скрываем уведомление и переходим на страницу разминки
        setIsVisible(false);
        if (onClose) onClose();
        navigate(`/workout-warmup/${userWorkoutId}`, {
          state: { warmup },
        });
      } else {
        // Не удалось начать разминку — просто закрываем уведомление
        handleClose();
      }
    } catch (err) {
      console.error('❌ Error starting warmup from notification:', err);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`notification ${isClosing ? 'fade-out' : ''}`}
      onClick={handleClick}
      role="alert"
      aria-live="polite"
    >
      <div className="notification-content">
        <p>{loading ? 'Загрузка...' : 'Рекомендуется сделать разминку'}</p>
      </div>
    </div>
  );
};

export default WarmupNotification; 