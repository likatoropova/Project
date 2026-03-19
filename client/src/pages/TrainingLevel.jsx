import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirstTest } from '../context/FirstTestContext';
import { getLevels, saveLevel } from '../api/userParamsAPI';
import { validators } from '../utils/validators';
import '../styles/lavel_of_training_style.scss';
import '../styles/header_footer.scss';
import '../styles/fonts.scss';
import '../styles/back_or_stop.css'
import Footer from '../components/Footer';
import Header from '../components/Header';

const TrainingLevel = () => {
  const navigate = useNavigate();
  const { completeGuestTest } = useFirstTest();
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const loadLevels = async () => {
      const result = await getLevels();
      if (result.success) {
        setLevels(result.data);
      } else {
        setError('Не удалось загрузить список уровней');
      }
      setDataLoading(false);
    };
    loadLevels();
  }, []);

  const handleLevelSelect = (levelId) => {
    setTouched(true);
    if (selectedLevel === levelId) {
      setSelectedLevel(null);
    } else {
      setSelectedLevel(levelId);
    }
    setError('');
  };

  const validateForm = () => {
    const error = validators.level(selectedLevel);
    setError(error);
    return !error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched(true);
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await saveLevel(selectedLevel);
      if (result?.success) {
        completeGuestTest();
        navigate('/test-plan');
      } else {
        setError(result?.error?.message || 'Ошибка сохранения');
      }
    } catch (err) {
      setError('Произошла ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className='pers_param_main'>
        <section className="hero-pers-param">
          <button
          className='back_button'
            onClick={() => navigate('/training-personal-param')}
            disabled={loading}
          >
            <svg class="back-img" width="10" height="23" viewBox="0 0 10 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L1 11.5L9 22" stroke="#2A2A2A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <img src="/img/personal-param-girl.png" alt="girl" />
        </section>
        
        <section className="content-section">
          <h1>Ваш фитнес старт</h1>
          <form className="form_container_level" onSubmit={handleSubmit} noValidate>
            <h2>Выберите Ваш уровень подготовки</h2>
            
            {error && touched && (
              <div className="error_message">
                {error}
              </div>
            )}
            
            {levels.map(level => (
              <div
                key={level.id}
                className={`radio_choice ${selectedLevel === level.id ? 'active' : ''}`}
                onClick={() => !loading && handleLevelSelect(level.id)}
              >
                <input
                  type="radio"
                  name="level"
                  id={`level_${level.id}`}
                  value={level.id}
                  checked={selectedLevel === level.id}
                  onChange={() => {}}
                  disabled={loading}
                />
                <label htmlFor={`level_${level.id}`}>{level.name}</label>
              </div>
            ))}
            
            <button
              type="submit"
              className="butn-param"
              disabled={loading || !selectedLevel}
              style={{
                opacity: (loading || !selectedLevel) ? 0.6 : 1,
                cursor: (loading || !selectedLevel) ? 'not-allowed' : 'pointer',
                backgroundColor: (selectedLevel && !loading) ? '#FC7D47' : '#FF9B65',
                color: (selectedLevel && !loading) ? '#FFFFFF' : '#FFFFFF'
              }}
            >
              {loading ? 'Сохранение...' : 'Завершить'}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TrainingLevel;