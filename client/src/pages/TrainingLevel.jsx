import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirstTest } from '../context/FirstTestContext';
import { saveLevel } from '../api/userParamsAPI';
import '../styles/lavel_of_training_style.css';
import '../styles/header_footer.css';
import '../styles/fonts.css';
import Footer from '../components/Footer';
import Header from '../components/Header';

const TrainingLevel = () => {
  const navigate = useNavigate();
  const { completeGuestTest } = useFirstTest();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLevel) {
      setError('Выберите уровень подготовки');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📤 Saving level:', selectedLevel);
      const result = await saveLevel(selectedLevel);
      console.log('📥 Save result:', result);

      if (result?.success) {
        // Отмечаем, что гость прошел тест
        completeGuestTest();
        console.log('✅ Guest test completed, redirecting to home');
        
        // Перенаправляем на главную
        navigate('/');
      } else {
        setError(result?.error?.message || 'Ошибка сохранения');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Произошла ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className='pers_param_main'>
        <section className="hero">
          <button 
            className="back_btn" 
            onClick={() => navigate('/training-personal-param')}
            disabled={loading}
          >
            &lt;
          </button>
          <img src="/img/personal-param-girl.png" alt="girl" />
        </section>
        
        <section className="content-section">
          <h1>Ваш фитнес старт</h1>
          <form className="form_container_level" onSubmit={handleSubmit} noValidate>
            <h2>Выберите Ваш уровень подготовки</h2>
            
            {error && (
              <div className="error_message" style={{
                color: '#721c24',
                padding: '10px',
                marginBottom: '15px',
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '4px'
              }}>
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
                <label htmlFor={`level_${level.id}`}>{level.label}</label>
              </div>
            ))}
            
            <button
              type="submit"
              className="butn"
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