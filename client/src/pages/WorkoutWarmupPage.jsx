import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { nextWarmup } from '../api/workoutAPI';
import '../styles/workout_warmup_style.scss';
import '../styles/header_footer.scss';
import '../styles/fonts.scss';

const WorkoutWarmupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userWorkoutId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Получаем данные разминки из location.state
  const [warmup, setWarmup] = useState(location.state?.warmup || null);

  const handleNext = async () => {
    if (!warmup?.id) {
      setError('Данные разминки не найдены');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📤 Getting next warmup:', { 
        userWorkoutId, 
        currentWarmupId: warmup.id 
      });
      
      const response = await nextWarmup(userWorkoutId, warmup.id);
      console.log('✅ Next warmup response:', response);
      
      if (response?.success) {
        const { type, warmup: nextWarmupData, exercise, needs_weight_input } = response.data;
        
        if (type === 'warmup' && nextWarmupData) {
          // Следующая разминка
          setWarmup(nextWarmupData);
        } else if (type === 'exercise' && exercise) {
          // Разминка завершена, переходим к упражнению
          if (needs_weight_input) {
            navigate(`/maximum-definition/${userWorkoutId}/${exercise.id}`, {
              state: { exercise }
            });
          } else {
            navigate(`/workout-exercise/${userWorkoutId}/${exercise.id}`, {
              state: { exercise }
            });
          }
        } else if (type === 'completed') {
          // Тренировка завершена
          navigate(`/workout-complete/${userWorkoutId}`);
        }
      } else {
        setError(response?.message || 'Ошибка при переходе к следующему упражнению');
      }
    } catch (err) {
      console.error('❌ Error getting next warmup:', err);
      setError(err.message || 'Ошибка при переходе');
    } finally {
      setLoading(false);
    }
  };

  const handleStopWarmup = async () => {
    if (window.confirm('Вы уверены, что хотите завершить разминку?')) {
      // Завершаем тренировку или возвращаемся к деталям
      navigate(`/workout-details/${userWorkoutId}`);
    }
  };

  const handleBack = () => {
    navigate(`/workout-details/${userWorkoutId}`);
  };

  if (!warmup) {
    return (
      <>
        <Header />
        <main className="main-exercise-warm">
          <div className="error-container">
            <p className="error-message">Разминка не найдена</p>
            <button className="back-button" onClick={handleBack}>
              Вернуться к тренировке
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main-exercise-warm">
        <img src="/img/bg-left.svg" className="bg-left" alt="bg" />
        
        <section className="warmup-cont">
          <h1>Разминка</h1>
          <p className="warmup-exercise">{warmup.name || 'Упражнение разминки'}</p>
          <img 
            src={warmup.image || "/img/training-image.png"} 
            alt="warmup"
            onError={(e) => {
              e.target.src = "/img/training-image.png";
            }}
          />
          <p className="description-exercise-warm">
            {warmup.description || `Выполняйте указанное упражнение ${warmup.duration_seconds || 60} секунд`}
          </p>
          
          {error && <span className="field_error">{error}</span>}
          
          <button 
            type="button" 
            className="next-warm"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Далее'}
          </button>
          <button 
            type="button" 
            className="stop-warm"
            onClick={handleStopWarmup}
            disabled={loading}
          >
            Закончить разминку
          </button>
        </section>
        
        <img src="/img/bg-right.svg" className="bg-right" alt="bg" />
      </main>
      <Footer />
    </>
  );
};

export default WorkoutWarmupPage;