// pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import { getUserParams } from '../api/userParamsAPI';
import '../styles/header_footer.css';
import '../styles/fonts.css';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [userParams, setUserParams] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserParams = async () => {
      if (isAuthenticated) {
        try {
          const response = await getUserParams();
          setUserParams(response.data);
        } catch (error) {
          console.error('Ошибка загрузки параметров:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserParams();
  }, [isAuthenticated]);

  return (
    <>
      <Header />
      <main className="home-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Добро пожаловать в LOGOTYPE!</h1>
            <p>Ваш персональный фитнес-тренер</p>
          </div>
        </section>
        {isAuthenticated && userParams && (
          <section className="user-params-section">
            <h2>Ваши параметры</h2>
            <div className="params-grid">
              <div className="param-card">
                <span className="param-label">Возраст</span>
                <span className="param-value">{userParams.age} лет</span>
              </div>
              <div className="param-card">
                <span className="param-label">Вес</span>
                <span className="param-value">{userParams.weight} кг</span>
              </div>
              <div className="param-card">
                <span className="param-label">Рост</span>
                <span className="param-value">{userParams.height} см</span>
              </div>
              <div className="param-card">
                <span className="param-label">Пол</span>
                <span className="param-value">
                  {userParams.gender === 'male' ? 'Мужской' : 'Женский'}
                </span>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Home;