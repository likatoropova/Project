import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSubscriptions } from '../hooks/useSubscriptions';
import '../styles/subscription_style.scss';
import '../styles/header_footer.scss';
import '../styles/fonts.scss';
import '../styles/back_or_stop.css'
import { Link } from 'react-router-dom';

const Subscriptions = () => {
  const navigate = useNavigate();
  const { subscriptions, loading, error, formatPrice, formatDuration } = useSubscriptions();

  const getDurationText = (days) => {
    if (days === 30) return 'месяц';
    if (days === 90) return 'месяца';
    if (days === 180) return 'месяцев';
    if (days === 365) return 'месяцев';
    return `${days} дней`;
  };

  const getNumberPart = (days) => {
    if (days === 30) return '1';
    if (days === 90) return '3';
    if (days === 180) return '6';
    if (days === 365) return '12';
    return days;
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="loading-container">
          <div className="spinner">Загрузка подписок...</div>
        </main>
        <Footer />
      </>
    );
  }

  // Проверяем, что subscriptions - это массив
  if (!subscriptions || !Array.isArray(subscriptions)) {
    return (
      <>
        <Header />
        <main className="main">
          <div className="title">
            <button className="back_btn" onClick={() => navigate(-1)}>
              &lt;
            </button>
            <h1>Подписки</h1>
          </div>
          <div className="error_message">
            Не удалось загрузить подписки
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main-subbscriptions">
        <div className="title-sub">
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg class="back-img" width="10" height="23" viewBox="0 0 10 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L1 11.5L9 22" stroke="#2A2A2A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <h1>Подписки</h1>
        </div>

        {error && (
          <div className="error_message">
            {error}
          </div>
        )}
        <img src="/img/bg-left.svg" alt="background" className="bg-l" />
        {subscriptions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            fontSize: '18px',
            color: '#666'
          }}>
            Нет доступных подписок
          </div>
        ) : (
          <section className="subscriptions-catalog">
            {subscriptions.map((sub) => (
              <article key={sub.id} className="subscription-card" onClick={() => navigate(`/subscriptions/${sub.id}`)}>
                <div className="info">
                  <div className="title-wrapper">
                    <h2>
                      {getNumberPart(sub.duration_days)}
                      <span>{getDurationText(sub.duration_days)}</span>
                    </h2>
                  </div>
                  <p className="price">{formatPrice(sub.price)}/мес</p>
                  <ul>
                    {sub.description && <li>{sub.description}</li>}
                  </ul>
                </div>
                <div className="image-wrapper">
                  <img 
                    src={sub.image || "/img/girl-subscription.png"} 
                    alt="subscription" 
                    onError={(e) => {
                      e.target.src = "/img/girl-subscription.png";
                    }}
                  />
                </div>
              </article>
            ))}
          </section>
        )}
        
        <img src="/img/bg-right.svg" alt="background" className="bg-r" />
      </main>
      <Footer />
    </>
  );
};

export default Subscriptions;