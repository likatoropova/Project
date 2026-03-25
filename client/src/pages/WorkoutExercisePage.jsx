import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { saveExerciseResult } from '../api/workoutAPI';
import '../styles/workout_exercise_style.scss';
import '../styles/header_footer.scss';
import '../styles/fonts.scss';

const WorkoutExercisePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userWorkoutId, exerciseId } = useParams();
  const [exercise, setExercise] = useState(location.state?.exercise || null);
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Состояния таймера
  const [timerState, setTimerState] = useState('work'); // 'work', 'rest', 'completed'
  const [timer, setTimer] = useState(420); // 7 минут = 420 секунд
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    document.title = 'Упражнение тренировки';
  }, []);

  // Таймер
  useEffect(() => {
    let interval = null;
    
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && timerState === 'work') {
      // Рабочий подход закончен, переходим к отдыху
      setTimerState('rest');
      setTimer(120); // 2 минуты = 120 секунд
      setTimerActive(true);
    } else if (timer === 0 && timerState === 'rest') {
      // Отдых закончен
      setTimerState('completed');
      setTimerActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timer, timerState]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStopWorkout = async () => {
    if (window.confirm('Вы уверены, что хотите остановить тренировку?')) {
      navigate('/trainings');
    }
  };

  const handleFeelingSelect = async (feeling) => {
    if (saving) return;
    
    setSelectedFeeling(feeling);
    setSaving(true);
    setError('');

    try {
      console.log('📤 Saving exercise result:', {
        userWorkoutId,
        exerciseId,
        feeling,
        weightUsed: exercise?.weight_used || exercise?.weight || 50
      });
      
      const result = await saveExerciseResult(
        userWorkoutId,
        parseInt(exerciseId),
        feeling,
        exercise?.weight_used || exercise?.weight || 50,
        exercise?.sets || 1,
        exercise?.reps || 10
      );
      
      console.log('✅ Exercise result saved:', result);
      
      if (result?.success) {
        const { next_exercise, all_exercises_completed } = result.data;
        const nextExerciseData = next_exercise?.exercise;   // вложенный объект с id, title и т.д.
        const needsWeightInput = next_exercise?.needs_weight_input;
        
        if (all_exercises_completed) {
          // Все упражнения завершены
          navigate(`/workout-complete/${userWorkoutId}`);
        } else if (next_exercise) {
          if (needsWeightInput) {
            navigate(`/maximum-definition/${userWorkoutId}/${nextExerciseData.id}`, {
              state: { exercise: nextExerciseData }
            });
          } else {
            navigate(`/workout-exercise/${userWorkoutId}/${nextExerciseData.id}`, {
              state: { exercise: nextExerciseData }
            });
          }
        }
      } else {
        setError(result?.message || 'Ошибка при сохранении результата');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'Ошибка при сохранении результата');
    } finally {
      setSaving(false);
    }
  };

  if (!exercise) {
    return (
      <>
        <Header />
        <main className="main-exercise">
          <div className="error-container">
            <p className="error-message">Упражнение не найдено</p>
            <button onClick={() => navigate(`/workout-details/${userWorkoutId}`)}>
              Вернуться к тренировке
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Получаем текст и стиль для таймера в зависимости от состояния
  const getTimerInfo = () => {
    switch (timerState) {
      case 'work':
        return {
          text: 'Время на подход',
          className: 'timer-work'
        };
      case 'rest':
        return {
          text: 'Отдых после подхода',
          className: 'timer-rest'
        };
      case 'completed':
        return {
          text: 'Упражнение закончено! Оцените подход',
          className: 'timer-completed'
        };
      default:
        return {
          text: '',
          className: ''
        };
    }
  };

  const timerInfo = getTimerInfo();

  return (
    <>
      <Header />
      <main className="main-exercise">
        <img src="/img/bg-left.svg" className="bg-left" alt="bg" />
        
        <section className="workout-cont">
          <section className="head-workout">
            <div>
              <button 
                className="stop_btn" 
                onClick={handleStopWorkout}
                disabled={saving}
              >
                <svg className="stop-img" width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.4927 0.132681C17.0547 -0.120225 16.4966 -0.00432362 16.1955 0.402092L1.33418 20.4603C1.14773 20.7119 1.08731 21.0353 1.17032 21.3373C1.39589 22.1579 2.46822 22.3572 2.97352 21.6724L17.7959 1.58546C18.1484 1.10771 18.0069 0.429548 17.4927 0.132681Z" fill="black"/>
                  <path d="M0.964323 0.132673C1.40237 -0.120236 1.96046 -0.00433388 2.26158 0.402086L17.1229 20.4602C17.3094 20.7119 17.3698 21.0353 17.2868 21.3373C17.0612 22.1579 15.9889 22.3571 15.4835 21.6724L0.661136 1.58547C0.308596 1.10772 0.450126 0.429544 0.964323 0.132673Z" fill="black"/>
                </svg>
              </button>
              <h1>Тренировка</h1>
            </div>
            <div className="timer-container">
              <p className={`timer-label ${timerInfo.className}`}>
                {timerInfo.text}
              </p>
              <p className={`timer-value ${timerInfo.className}`}>
                {timerState !== 'completed' ? formatTime(timer) : ''}
              </p>
            </div>
          </section>
          
          <section className="workout-group">
            <p className="workout-exercise">{exercise.title}</p>
            <img 
              src={exercise.image || "/img/training-image.png"} 
              alt="workout" 
              onError={(e) => {
                e.target.src = "/img/training-image.png";
              }}
            />
            <p className="description-exercise">
              {exercise.description || `Выполняйте данное упражнение ${exercise.reps || 10} раз`}
              {exercise.weight_used && ` с весом ${exercise.weight_used}кг`}
            </p>
            
            <div className="feeling-of-exercise">
              {timerState === 'completed' ? (
                <>
                  <p>Как ощущался данный подход?</p>
                  {error && <span className="field_error">{error}</span>}
                  <div className="emotions">
                    <button 
                      className={`emotion-btn ${selectedFeeling === 'bad' ? 'active' : ''}`}
                      onClick={() => handleFeelingSelect('bad')}
                      disabled={saving}
                    >
                      <img src="/img/sad-emotion.svg" alt="плохо" />
                    </button>
                    <button 
                      className={`emotion-btn ${selectedFeeling === 'normal' ? 'active' : ''}`}
                      onClick={() => handleFeelingSelect('normal')}
                      disabled={saving}
                    >
                      <img src="/img/normal-emotion.svg" alt="нормально" />
                    </button>
                    <button 
                      className={`emotion-btn ${selectedFeeling === 'good' ? 'active' : ''}`}
                      onClick={() => handleFeelingSelect('good')}
                      disabled={saving}
                    >
                      <img src="/img/good-emotion.svg" alt="хорошо" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="workout-instruction">
                  <p>Выполняйте упражнение в течение отведенного времени</p>
                </div>
              )}
            </div>
          </section>
        </section>
        
        <img src="/img/bg-right.svg" className="bg-right" alt="bg" />
      </main>
      <Footer />
    </>
  );
};

export default WorkoutExercisePage;