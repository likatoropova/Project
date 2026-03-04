import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuestTest } from '../context/FirstTestContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/lavel_of_training_style.css';
import '../styles/header_footer.css';
import '../styles/fonts.css';

const TrainingLevel = () => {
  const navigate = useNavigate();
  const { guestId, saveGuestLevel, guestData } = useGuestTest();
  const [selectedLevel, setSelectedLevel] = useState(guestData?.level?.level_id || null);
  const [error, setError] = useState('');

  const levels = [
    { id: 1, label: 'Новичок' },
    { id: 2, label: 'Опытный' },
    { id: 3, label: 'Продвинутый' }
  ];

  useEffect(() => {
    if (!guestId) {
      console.log('⏳ Waiting for guest ID...');
    }
  }, [guestId]);

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedLevel) {
      setError('Выберите уровень подготовки');
      return;
    }

    saveGuestLevel(selectedLevel);
    
    // После сохранения всех данных показываем сообщение
    alert('Данные сохранены! Теперь вы можете зарегистрироваться или войти.');
    navigate('/');
  };

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <button className="back_btn" onClick={() => navigate('/training-personal-param')}>
            &lt;
          </button>
          <img src="/img/personal-param-girl.png" alt="girl" />
        </section>
        
        <section className="content-section">
          <h1>Ваш фитнес старт</h1>
          <form className="form_container" onSubmit={handleSubmit}>
            <h2>Выберите Ваш уровень подготовки</h2>
            
            {error && <div className="error_message">{error}</div>}
            
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
            
            <button type="submit" className="butn">
              Завершить
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TrainingLevel;