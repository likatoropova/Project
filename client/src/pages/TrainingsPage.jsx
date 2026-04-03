import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useWorkouts } from '../hooks/useWorkouts';
import '../styles/trainings.scss';
import '../styles/header_footer.scss';
import '../styles/fonts.scss';

const TrainingsPage = () => {
  const navigate = useNavigate();
  const { 
    allAssigned, 
    allStarted, 
    loading, 
    error,
    formatDuration,
    getWorkoutType
  } = useWorkouts();

  const [searchInput, setSearchInput] = useState('');
  const [filteredAssigned, setFilteredAssigned] = useState([]);
  const [filteredStarted, setFilteredStarted] = useState([]);

  // Функция фильтрации тренировок
  const filterWorkouts = (workouts, searchTerm) => {
    if (!workouts || !Array.isArray(workouts)) return [];
    if (!searchTerm.trim()) return workouts;
    
    return workouts.filter(item => 
      item?.workout?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.workout?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Обновляем отфильтрованные списки
  useEffect(() => {
    setFilteredAssigned(filterWorkouts(allAssigned, searchInput));
    setFilteredStarted(filterWorkouts(allStarted, searchInput));
  }, [searchInput, allAssigned, allStarted]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleWorkoutClick = (userWorkoutId) => {
    navigate(`/workout-details/${userWorkoutId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="main">
          <div className="loading-container">
            <div className="spinner">Загрузка тренировок...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="main">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={() => window.location.reload()}>
              Повторить попытку
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const WorkoutCard = ({ item }) => {
    if (!item) return null;
    
    const { user_workout_id, workout, phase, status } = item;
    const isStarted = status === 'started' || item.is_started;
    
    return (
      <article 
        className="training_card" 
        onClick={() => handleWorkoutClick(user_workout_id)}
      >
        <img 
          src={workout?.image || "/img/training-image.png"} 
          alt={workout?.title || 'Тренировка'}
          onError={(e) => {
            e.target.src = "/img/training-image.png";
          }}
        />
        <div>
          <h2>{getWorkoutType(workout?.type)}</h2>
          <p className="time">{formatDuration(workout?.duration_minutes)}</p>
          <p className="description-training">{workout?.description || 'Описание тренировки'}</p>
          <button 
            type="button"
            className={isStarted ? 'continue-btn' : 'start-btn'}
            onClick={(e) => {
              e.stopPropagation();
              handleWorkoutClick(user_workout_id);
            }}
          >
            {isStarted ? 'Продолжить' : 'Перейти'}
          </button>
        </div>
      </article>
    );
  };

  const hasAnyWorkouts = (allAssigned?.length > 0) || (allStarted?.length > 0);
  const hasFilteredWorkouts = (filteredAssigned?.length > 0) || (filteredStarted?.length > 0);

  return (
    <>
      <Header />
      <main className="main">
        <section className="head">
          <div className="title-work">
            <button className="back_button" onClick={handleBack}>
              <svg className="back-img" width="10" height="23" viewBox="0 0 10 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L1 11.5L9 22" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1>Тренировки</h1>
          </div>
          <p>
            Тренировки, которые были подобраны специально под вас. 
            Больше упражнений для ваших тренировок можно найти в нашей подписке
          </p>
        </section>

        <div className="search_training">
          <div>
            <img src="/img/search.png" alt="search" />
            <input
              type="text"
              placeholder="Поиск тренировок"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Назначенные тренировки */}
        {filteredAssigned.length > 0 && (
          <section className="trainings-section">
            <div className="trainings_container">
              {filteredAssigned.map((item) => (
                <WorkoutCard key={item.user_workout_id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Начатые тренировки */}
        {filteredStarted.length > 0 && (
          <section className="trainings-section">
            <div className="trainings_container">
              {filteredStarted.map((item) => (
                <WorkoutCard key={item.user_workout_id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Если есть тренировки, но по поиску ничего не найдено */}
        {hasAnyWorkouts && !hasFilteredWorkouts && (
          <div className="no-results">
            <p>По вашему запросу "{searchInput}" ничего не найдено</p>
            <button 
              className="clear-search-btn"
              onClick={() => setSearchInput('')}
            >
              Сбросить поиск
            </button>
          </div>
        )}

        {/* Если нет тренировок вообще */}
        {!hasAnyWorkouts && !error && (
          <div className="empty-state">
            <p>У вас пока нет тренировок</p>
            <button className="browse-btn" onClick={() => navigate('/subscriptions')}>
              Посмотреть подписки
            </button>
          </div>
        )}

        <img className="back" src="/img/bg-right.svg" alt="back" />
      </main>
      <Footer />
    </>
  );
};

export default TrainingsPage;