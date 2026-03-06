import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirstTest } from '../context/FirstTestContext';
import { saveGoal } from '../api/userParamsAPI';
import '../styles/training_goal_style.css';
import '../styles/header_footer.css';
import '../styles/fonts.css';
import Footer from '../components/Footer';
import Header from '../components/Header';

const TrainingGoal = () => {
  const navigate = useNavigate();
  const { setGuestIdFromApi } = useFirstTest();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [hotspotsActive, setHotspotsActive] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const goals = [
    { id: 1, label: 'Рост силовых показателей', hotspotClass: 'power' },
    { id: 2, label: 'Рост мышечной массы', hotspotClass: 'muscle' },
    { id: 3, label: 'Жиросжигание', hotspotClass: 'fat' },
    { id: 4, label: 'Общее укрепление организма', hotspotClass: 'general' }
  ];

  useEffect(() => {
    // Очищаем только флаг завершения теста, но НЕ удаляем guestId
    localStorage.removeItem('guestParamsCompleted');
    console.log('🧹 Cleared guestParamsCompleted flag');
  }, []);

  const handleGoalSelect = (goalId) => {
    if (selectedGoal === goalId) {
      setSelectedGoal(null);
      setHotspotsActive({});
    } else {
      setSelectedGoal(goalId);
      
      const goal = goals.find(g => g.id === goalId);
      if (goal) {
        const newHotspots = {};
        document.querySelectorAll(`.hotspot.${goal.hotspotClass}`).forEach((_, index) => {
          newHotspots[`${goal.hotspotClass}-${index}`] = true;
        });
        setHotspotsActive(newHotspots);
      }
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedGoal) {
      setError('Выберите цель тренировок');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📤 Saving goal:', selectedGoal);
      const result = await saveGoal(selectedGoal);
      console.log('📥 Save result:', result);

      if (result?.success) {
        // Сохраняем guest_id из ответа API
        if (result.data?.data?.guest_id) {
          setGuestIdFromApi(result.data.data.guest_id);
        }
        
        // Переходим на следующий шаг без проверки контекста
        navigate('/training-personal-param');
      } else {
        setError(result?.error?.message || 'Ошибка сохранения');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="hero">
          <img src="/img/personal-param-girl.png" alt="girl" />
          
          {goals.map(goal => (
            <div
              key={goal.id}
              className={`hotspot ${goal.hotspotClass} ${selectedGoal === goal.id ? 'active' : ''}`}
              onClick={() => !loading && handleGoalSelect(goal.id)}
            />
          ))}
        </div>

        <section className="form-section">
          <h1>Ваш фитнес старт</h1>
          <form className="form_container" onSubmit={handleSubmit}>
            <legend>Выберите Вашу цель тренировок</legend>
            
            {error && <div className="error_message">{error}</div>}
            
            {goals.map(goal => (
              <div 
                key={goal.id}
                className={`radio_choice ${selectedGoal === goal.id ? 'active' : ''}`}
                onClick={() => !loading && handleGoalSelect(goal.id)}
              >
                <input
                  type="radio"
                  id={`goal_${goal.id}`}
                  name="personal_param"
                  value={goal.id}
                  checked={selectedGoal === goal.id}
                  onChange={() => {}}
                  disabled={loading}
                />
                <label htmlFor={`goal_${goal.id}`}>{goal.label}</label>
              </div>
            ))}
            
            <button
              type="submit"
              className="butn"
              disabled={loading || !selectedGoal}
              style={{
                opacity: (loading || !selectedGoal) ? 0.6 : 1,
                cursor: (loading || !selectedGoal) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Сохранение...' : 'Далее'}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TrainingGoal;