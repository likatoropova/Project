import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useApi } from '../hooks/useApi';
import { saveLevel } from '../api/userParamsAPI';
import '../styles/lavel_of_training_style.css';
import '../styles/header_footer.css';
import '../styles/fonts.css';

const TrainingLevel = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [error, setError] = useState('');
  
  const { execute: executeSaveLevel, loading } = useApi(saveLevel);
  const levels = [
    { id: 1, label: 'Новичок' },
    { id: 2, label: 'Опытный' },
    { id: 3, label: 'Продвинутый' }
  ];

  const handleLevelSelect = (levelId) => {
    if (selectedLevel === levelId) {
      setSelectedLevel(null);
    } else {
      setSelectedLevel(levelId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLevel) {
      setError('Выберите уровень подготовки');
      return;
    }

    setError('');
    
    const result = await executeSaveLevel(selectedLevel);

    if (result.success) {
      localStorage.setItem('firstTestPassed', 'true');
      navigate('/');
    }
  };

  return (
    <>
      <Header />
      <main className='pers_param_main'>
        <section className="hero">
          <button className="back_btn" onClick={() => navigate('/training-personal-param')}>
            &lt;
          </button>
          <img src="/img/personal-param-girl.png" alt="girl" />
        </section>
        
        <section className="content-section">
          <h1>Ваш фитнес старт</h1>
          <form className="form_container_level" onSubmit={handleSubmit}>
            <h2>Выберите Ваш уровень подготовки</h2>
            
            {error && (
              <div className="error_message">
                {error}
              </div>
            )}
            
            {levels.map(level => (
              <div 
                key={level.id}
                className={`radio_choice ${selectedLevel === level.id ? 'active' : ''}`}
                onClick={() => handleLevelSelect(level.id)}
              >
                <input
                  type="radio"
                  name="level"
                  id={`level_${level.id}`}
                  value={level.id}
                  checked={selectedLevel === level.id}
                  onChange={() => {}}
                />
                <label htmlFor={`level_${level.id}`}>{level.label}</label>
              </div>
            ))}
            
            <button
              type="submit"
              className="butn"
              disabled={loading || !selectedLevel}
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

export default TrainingLevel;