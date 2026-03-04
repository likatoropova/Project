import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuestTest } from '../context/FirstTestContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/training_goal_style.css';
import '../styles/header_footer.css';
import '../styles/fonts.css';

const TrainingGoal = () => {
  const navigate = useNavigate();
  const { guestId, saveGuestGoal, guestData } = useGuestTest();
  const [selectedGoal, setSelectedGoal] = useState(guestData?.goal?.goal_id || null);
  const [error, setError] = useState('');

  const goals = [
    { id: 1, label: 'Рост силовых показателей' },
    { id: 2, label: 'Рост мышечной массы' },
    { id: 3, label: 'Жиросжигание' },
    { id: 4, label: 'Общее укрепление организма' }
  ];

  useEffect(() => {
    if (!guestId) {
      console.log('⏳ Waiting for guest ID...');
    } else {
      console.log('✅ Guest ID ready:', guestId);
    }
  }, [guestId]);

  const handleGoalSelect = (goalId) => {
    setSelectedGoal(goalId);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedGoal) {
      setError('Выберите цель тренировок');
      return;
    }

    saveGuestGoal(selectedGoal);
    navigate('/training-personal-param');
  };

  return (
    <>
      <Header />
      <main>
        <section className="form-section">
          <h1>Ваш фитнес старт</h1>
          <form className="form_container" onSubmit={handleSubmit}>
            <legend>Выберите Вашу цель тренировок</legend>
            
            {error && <div className="error_message">{error}</div>}
            
            {goals.map(goal => (
              <div 
                key={goal.id}
                className={`radio_choice ${selectedGoal === goal.id ? 'active' : ''}`}
                onClick={() => handleGoalSelect(goal.id)}
              >
                <input
                  type="radio"
                  name="goal"
                  id={`goal_${goal.id}`}
                  value={goal.id}
                  checked={selectedGoal === goal.id}
                  onChange={() => {}}
                />
                <label htmlFor={`goal_${goal.id}`}>{goal.label}</label>
              </div>
            ))}
            
            <button type="submit" className="butn">
              Далее
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TrainingGoal;