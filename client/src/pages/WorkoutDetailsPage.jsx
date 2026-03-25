import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useWorkoutDetails } from '../hooks/useWorkoutDetails';
import { startWorkout } from '../api/workoutAPI';
import '../styles/workout_details_style.scss';
import '../styles/header_footer.scss';
import '../styles/fonts.scss';

const WorkoutDetailsPage = () => {
  const navigate = useNavigate();
  const { userWorkoutId } = useParams();
  const [startingWarmup, setStartingWarmup] = useState(false);
  const [startingWorkout, setStartingWorkout] = useState(false);
  
  const { 
    workoutData, 
    loading, 
    error, 
    formatDuration, 
    formatTime, 
    getWorkoutType 
  } = useWorkoutDetails(userWorkoutId);

  const handleBack = () => {
    navigate('/trainings');
  };

  useEffect(() => {
    document.title = 'Тренировка';
  }, []);

  // Начать разминку
  const handleStartWarmup = async () => {
    if (!workoutData?.workout?.id) return;
    
    setStartingWarmup(true);
    try {
      const response = await startWorkout(workoutData.workout.id, true);
      
      if (response?.success) {
        const { type, warmup, exercise, needs_weight_input } = response.data;
        
        if (type === 'warmup' && warmup) {
          navigate(`/workout-warmup/${userWorkoutId}`, {
            state: { warmup }
          });
        } else if (type === 'exercise' && exercise) {
          // Первое упражнение - проверяем, нужно ли определять вес
          if (needs_weight_input) {
            navigate(`/maximum-definition/${userWorkoutId}/${exercise.id}`, {
              state: { exercise }
            });
          } else {
            navigate(`/workout-exercise/${userWorkoutId}/${exercise.id}`, {
              state: { exercise }
            });
          }
        }
      }
    } catch (err) {
      console.error('❌ Error starting warmup:', err);
    } finally {
      setStartingWarmup(false);
    }
  };

  // Начать основную тренировку
  const handleStartWorkout = async () => {
    if (!workoutData?.workout?.id) return;
    
    setStartingWorkout(true);
    try {
      const response = await startWorkout(workoutData.workout.id, false);
      
      if (response?.success) {
        const { type, exercise, needs_weight_input } = response.data;
        
        if (type === 'exercise' && exercise) {
          // Первое упражнение - проверяем, нужно ли определять вес
          if (needs_weight_input) {
            navigate(`/maximum-definition/${userWorkoutId}/${exercise.id}`, {
              state: { exercise }
            });
          } else {
            navigate(`/workout-exercise/${userWorkoutId}/${exercise.id}`, {
              state: { exercise }
            });
          }
        }
      }
    } catch (err) {
      console.error('❌ Error starting workout:', err);
    } finally {
      setStartingWorkout(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="main-workout">
          <div className="loading-container">
            <div className="spinner">Загрузка тренировки...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !workoutData) {
    return (
      <>
        <Header />
        <main className="main-workout">
          <div className="error-container">
            <p className="error-message">{error || 'Тренировка не найдена'}</p>
            <button className="back-button" onClick={handleBack}>
              Вернуться к тренировкам
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { workout, warmups } = workoutData;
  const hasWarmup = warmups && warmups.length > 0;
  const totalWarmupTime = hasWarmup 
    ? warmups.reduce((acc, w) => acc + (w.duration_seconds || 0), 0) 
    : 0;

  return (
    <>
      <Header />
      <main className="main-workout">
        <section className="workout-detail-cont">
          <div className="title-section">
            <button className="back_button" onClick={handleBack}>
              <svg className="back-img" width="10" height="23" viewBox="0 0 10 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L1 11.5L9 22" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1>Тренировка</h1>
          </div>
          
          <section className="workout-detail-group">
            {/* Разминка - только если есть */}
            {hasWarmup && (
              <article className="workout-card">
                <img 
                  src="/img/training-image.png" 
                  alt="warmup"
                />
                <div>
                  <h2>Комплексная разминка</h2>
                  <p className="time-workout">
                    {formatTime(totalWarmupTime)}
                  </p>
                  <p className="description-workout">
                    Подготовить тело к нагрузке, разогреть мышцы и суставы, предотвратить травмы
                  </p>
                  <button 
                    type="button" 
                    className="submit-workout"
                    onClick={handleStartWarmup}
                    disabled={startingWarmup}
                  >
                    {startingWarmup ? 'Загрузка...' : 'Начать разминку'}
                  </button>
                </div>
              </article>
            )}

            {/* Основная тренировка - всегда показываем */}
            <article className="workout-card">
              <img 
                src={workout.image || "/img/training-image.png"} 
                alt={workout.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/img/training-image.png";
                }}
              />
              <div>
                <h2>{getWorkoutType(workout.type)}</h2>
                <p className="time-workout">
                  {formatDuration(workout.duration_minutes)}
                </p>
                <p className="description-workout">
                  {workout.description || 'Полноформатная тренировка на всё тело: прорабатываем крупные мышечные группы, сжигаем калории и повышаем выносливость'}
                </p>
                <button 
                  type="button" 
                  className="submit-workout"
                  onClick={handleStartWorkout}
                  disabled={startingWorkout}
                >
                  {startingWorkout ? 'Загрузка...' : 'Начать тренировку'}
                </button>
              </div>
            </article>
          </section>
        </section>

        <img className="bg-reverse" src="/img/bg-left.svg" alt="background" />
      </main>
      <Footer />
    </>
  );
};

export default WorkoutDetailsPage;