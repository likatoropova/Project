import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { saveGoal } from '../api/userParamsAPI';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/training_goal_style.css';
import '../styles/header_footer.css';
import '../styles/fonts.css';

const TrainingGoal = () => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [hotspotsActive, setHotspotsActive] = useState({});
  const [error, setError] = useState('');
  
  const { execute: executeSaveGoal, loading } = useApi(saveGoal);

  const goals = [
    { id: 1, label: 'Рост силовых показателей', hotspotClass: 'power' },
    { id: 2, label: 'Рост мышечной массы', hotspotClass: 'muscle' },
    { id: 3, label: 'Жиросжигание', hotspotClass: 'fat' },
    { id: 4, label: 'Общее укрепление организма', hotspotClass: 'general' }
  ];

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedGoal) {
      setError('Выберите цель тренировок');
      return;
    }

    setError('');
    
    const result = await executeSaveGoal(selectedGoal);

    if (result.success) {
      navigate('/training-personal-param');
    }
  };

  return (
    <>
      <Header />
      <main className='pers_param_main'>
        <div className="hero">
          <img src="/img/personal-param-girl.png" alt="girl" />
          <div className={`hotspot power ${hotspotsActive['power-0'] ? 'active' : ''}`} 
               data-target="growth_of_power"
               onClick={() => handleGoalSelect('growth_of_power')}></div>
          
          <div className={`hotspot muscle ${hotspotsActive['muscle-0'] ? 'active' : ''}`} 
               id="muscle1"
               data-target="muscle_growth"
               onClick={() => handleGoalSelect('muscle_growth')}></div>
          
          <div className={`hotspot muscle ${hotspotsActive['muscle-1'] ? 'active' : ''}`} 
               id="muscle2"
               data-target="muscle_growth"
               onClick={() => handleGoalSelect('muscle_growth')}></div>
          
          <div className={`hotspot fat ${hotspotsActive['fat-0'] ? 'active' : ''}`} 
               data-target="fat_burning"
               onClick={() => handleGoalSelect('fat_burning')}></div>
          
          <div className={`hotspot general ${hotspotsActive['general-0'] ? 'active' : ''}`} 
               id="general1"
               data-target="strengthening"
               onClick={() => handleGoalSelect('strengthening')}></div>
          
          <div className={`hotspot general ${hotspotsActive['general-1'] ? 'active' : ''}`} 
               id="general2"
               data-target="strengthening"
               onClick={() => handleGoalSelect('strengthening')}></div>
          
          <div className={`hotspot general ${hotspotsActive['general-2'] ? 'active' : ''}`} 
               id="general3"
               data-target="strengthening"
               onClick={() => handleGoalSelect('strengthening')}></div>
        </div>

        <section className="form-section">
          <h1>Ваш фитнес старт</h1>
          <form className="form_container_goal" onSubmit={handleSubmit}>
            <legend>Выберите Вашу цель тренировок</legend>
            {goals.map(goal => (
              <div 
                key={goal.id}
                className={`radio_choice ${selectedGoal === goal.id ? 'active' : ''}`}
                onClick={() => handleGoalSelect(goal.id)}
              >
                <input
                  type="radio"
                  id={`goal_${goal.id}`}
                  name="personal_param"
                  value={goal.id}
                  checked={selectedGoal === goal.id}
                  onChange={() => {}}
                />
                <label htmlFor={`goal_${goal.id}`}>{goal.label}</label>
              </div>
            ))}
            
            <button
              type="submit"
              className="butn"
              disabled={loading || !selectedGoal}
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