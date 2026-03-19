import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';
import { useSubscriptionDetails } from '../hooks/useSubscriptionDetails';
import '../styles/subscription_details_style.scss';
import '../styles/header_footer.scss';
import '../styles/fonts.scss';
import '../styles/back_or_stop.css'

const SubscriptionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    subscription,
    loading,
    error,
    formatPrice,
    getDurationText,
    getNumberPart
  } = useSubscriptionDetails(id);

  const handlePaymentSuccess = (paymentData) => {
    console.log('Платеж успешен:', paymentData);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="loading-container">
          <div className="spinner">Загрузка информации о подписке...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !subscription) {
    return (
      <>
        <Header />
        <main className="main_sub_details">
          <div className="title">
            <button className="back-button" onClick={() => navigate('/subscriptions')}>
              <svg class="back-img" width="10" height="23" viewBox="0 0 10 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L1 11.5L9 22" stroke="#2A2A2A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <h1>Подписки</h1>
          </div>
          <div className="error_message">
            {error || 'Подписка не найдена'}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main_sub_details">
        <div className="title">
          <button className="back_button" onClick={() => navigate(-1)}>
            <svg class="back-img" width="10" height="23" viewBox="0 0 10 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L1 11.5L9 22" stroke="#2A2A2A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <h1>Подписки</h1>
        </div>

        <section className="sub-info">
          <article className="subscription-card-detail">
            <div className="info">
              <div className="title-wrapper">
                <h2>
                  {getNumberPart(subscription.duration_days)}
                  <span>{getDurationText(subscription.duration_days)}</span>
                </h2>
              </div>
              <p className="price">{formatPrice(subscription.price)}/мес</p>
              <ul className="features">
                {subscription.description && <li>{subscription.description}</li>}
              </ul>
            </div>
            <div className="image-wrapper">
              <img 
                src={subscription.image || "/img/girl-subscription.png"} 
                alt="subscription" 
                onError={(e) => {
                  e.target.src = "/img/girl-subscription.png";
                }}
              />
            </div>
          </article>

          <div className="sub-details">
            <article>
              <h2>Подписка "{subscription.name}"</h2>
              <p>Полный доступ к персональной системе тренировок</p>
              <ul>
                <li>Для начинающих, кто хочет стартовать правильно</li>
                <li>Для тех, кто хочет тренироваться осознанно, а не наугад</li>
                <li>Для всех, кто ценит персонализацию и современные технологии в спорте</li>
              </ul>
              <h2 className="price-tag">{formatPrice(subscription.price)}/мес</h2>
              <button 
                className="subscribe-btn"
                onClick={() => setIsModalOpen(true)}
              >
                Оформить подписку
              </button>
            </article>
          </div>
        </section>

        <section className="sub-advantages">
          <div className="description">
            <h2>Наши преимущества</h2>
            <p>Не просто доступ к функциям, а <span>индивидуальный</span> фитнес-маршрут, который строится на ваших уникальных данных и целях. Получите максимум от каждой тренировки.</p>
          </div>
          
          <div className='advantages'>
            <article>
              <div><img src="/img/icon-advantages.svg" alt="icon" /></div>
              <div>
                <h3>Умное управление нагрузкой</h3>
                <p>Технология, которая помогает повысить эффективность силовых упражнений и ускорить восстановление мышц.</p>
              </div>
            </article>
            
            <article>
              <div><img src="/img/icon-advantages.svg" alt="icon" /></div>
              <div>
                <h3>Профилактика травм</h3>
                <p>Рекомендации по разминке и заминке, подобранные под ваш тип тренировки.</p>
              </div>
            </article>
            
            <article>
              <div><img src="/img/icon-advantages.svg" alt="icon" /></div>
              <div>
                <h3>Расширенная диагностика</h3>
                <p>Набор из специализированных тестов (сила, выносливость, мобильность, тип телосложения) для точного определения вашего уровня.</p>
              </div>
            </article>
            
            <article>
              <div><img src="/img/icon-advantages.svg" alt="icon" /></div>
              <div>
                <h3>Персональный план</h3>
                <p>Автоматически сформированная программа тренировок, которая адаптируется по мере вашего прогресса.</p>
              </div>
            </article>
          </div>
        </section>
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          subscription={subscription}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </main>
      <Footer />
    </>
  );
};

export default SubscriptionDetails;