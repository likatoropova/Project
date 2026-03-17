import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirstTest } from '../context/FirstTestContext';
import { getGoals, saveGoal } from '../api/userParamsAPI';
import '../styles/training_goal_style.scss';
import '../styles/header_footer.scss';
import '../styles/fonts.scss';
import Footer from '../components/Footer';
import Header from '../components/Header';

const TrainingGoal = () => {
  const navigate = useNavigate();
  const { setGuestIdFromApi } = useFirstTest();
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [hotspotsActive, setHotspotsActive] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      const result = await getGoals();
      if (result.success) {
        setGoals(result.data);
      } else {
        setError('Не удалось загрузить список целей');
      }
      setDataLoading(false);
    };
    loadGoals();
  }, []);

   const handleGoalSelect = (goalId) => {
    if (selectedGoal === goalId) {
      setSelectedGoal(null);
      setHotspotsActive({});
    } else {
      setSelectedGoal(goalId);
      
      const goal = goals.find(g => g.id === goalId);
      if (goal) {
        let hotspotClass = 'general';
        if (goal.name.includes('силовых')) hotspotClass = 'power';
        else if (goal.name.includes('мышечной')) hotspotClass = 'muscle';
        else if (goal.name.includes('Жиросжигание')) hotspotClass = 'fat';
        
        const newHotspots = {};
        document.querySelectorAll(`.hotspot.${hotspotClass}`).forEach((_, index) => {
          newHotspots[`${hotspotClass}-${index}`] = true;
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
      const result = await saveGoal(selectedGoal);
      if (result?.success) {
        if (result.data?.data?.guest_id) {
          setGuestIdFromApi(result.data.data.guest_id);
        }
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
      <main className='pers_param_main'>
        <div className="hero-pers-goal">
          <img src="/img/personal-param-girl.png" alt="girl" />
          <div className={`hotspot power ${hotspotsActive['power-0'] ? 'active' : ''}`} />
          <div className={`hotspot muscle ${hotspotsActive['muscle-0'] ? 'active' : ''}`} id="muscle1" />
          <div className={`hotspot muscle ${hotspotsActive['muscle-1'] ? 'active' : ''}`} id="muscle2" />
          <div className={`hotspot fat ${hotspotsActive['fat-0'] ? 'active' : ''}`} />
          <div className={`hotspot general ${hotspotsActive['general-0'] ? 'active' : ''}`} id="general1" />
          <div className={`hotspot general ${hotspotsActive['general-1'] ? 'active' : ''}`} id="general2" />
          <div className={`hotspot general ${hotspotsActive['general-2'] ? 'active' : ''}`} id="general3" />
        </div>

        <section className="form-section">
          <h1>Ваш фитнес старт</h1>
          <form className="form_container_goal" onSubmit={handleSubmit}>
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
                <label htmlFor={`goal_${goal.id}`}>{goal.name}</label>
              </div>
            ))}
            
            <button
              type="submit"
              className="butn-param"
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