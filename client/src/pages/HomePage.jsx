import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TestSlider from '../components/TestSlider';
import { useTests } from '../hooks/useTests';
import { useSubscriptions } from '../hooks/useSubscriptions';
import '../styles/home_page_style.css'; // Изменен импорт стилей

const HomePage = () => {
   const { tests, loading: testsLoading, error: testsError, loadTests } = useTests(10);
  const { subscriptions, loading: subsLoading, error: subsError, fetchSubscriptions, formatPrice, formatDuration } = useSubscriptions();

  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // Загрузка данных
  useEffect(() => {
    document.title = 'moveUp - Главная';
    const loadData = async () => {
      setPageLoading(true);
      try {
        await Promise.all([loadTests(), fetchSubscriptions()]);
        setPageError(null);
      } catch (err) {
        setPageError('Ошибка загрузки данных');
        console.error('Error loading home page data:', err);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [loadTests, fetchSubscriptions]);

  // Состояние загрузки
  if (pageLoading || testsLoading || subsLoading) {
    return (
        <>
          <Header />
          <main>
            <div className="loading_container">
              <div className="loading_spinner"></div>
              <p>Загрузка главной страницы...</p>
            </div>
          </main>
          <Footer />
        </>
    );
  }

  // Состояние ошибки
  if (pageError || testsError || subsError) {
    return (
        <>
          <Header />
          <main>
            <div className="error_container">
              <p>{pageError || testsError || subsError}</p>
              <button onClick={() => window.location.reload()}>
                Повторить загрузку
              </button>
            </div>
          </main>
          <Footer />
        </>
    );
  }

  return (
      <>
        <Header />
        <main className="main_home">
          {/* Баннер */}
          <div className="baner">
            <p>МЫ ПОСТРОИМ ТВОЙ ПУТЬ К ИДЕАЛЬНОЙ ФОРМЕ: ОТ ПЕРВОЙ РАЗМИНКИ ДО СЛОЖНЫХ ПРОГРАММ</p>
            <img
                src="/img/baner.png"
                className="main-image nebo-custom"
                alt="banner"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1875x972?text=MoveUP';
                }}
            />

            <div className="programmes">
              <div className="personal_programme">
                <img src="/img/fit.png" alt="fit" />
                <p>Персональная программа</p>
              </div>
              <div className="personal_programme">
                <img src="/img/fit.png" alt="fit" />
                <p>Персональная программа</p>
              </div>
            </div>

            <div className="logo_btn">
              <h1>moveUP</h1>
              <Link to="/training-program">Начать тренироваться</Link>
            </div>
          </div>

          <div className="subscriptions">
            <div className="about_subs">
              <h3>Подписки</h3>
              <p>
                С ПРИОБРЕТЕНИЕМ НАШЕЙ ПОДПИСКИ, ВАМ ОТКРОЕТСЯ ДОСТУП
                К БОЛЬШЕМУ КОЛИЧЕСТВУ ТЕСТОВ И УПРАЖНЕНИЙ!
              </p>
            </div>

            {subscriptions.length === 0 ? (
                <div className="empty_container">
                  <p>Подписки временно недоступны</p>
                </div>
            ) : (
                <div className="cards_sub_container">
                  <div className="card_sub_container">
                    {subscriptions.slice(0, Math.ceil(subscriptions.length / 2)).map(sub => (
                        <div key={sub.id} className="subscription_card">
                          <div className="description_sub">
                            <p className="month">
                              {sub.duration_days === 30 ? '1' : Math.floor(sub.duration_days / 30)}
                              <span>{formatDuration(sub.duration_days)}</span>
                            </p>
                            <p className="count">{formatPrice(sub.price)}/мес</p>
                            <ul>
                              <li>{sub.description || 'Расширенный набор тестов для качественной адаптации'}</li>
                            </ul>
                          </div>
                          <img
                              src="/img/sub.png"
                              alt="subscription"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/280x350?text=Subscription';
                              }}
                          />
                        </div>
                    ))}
                  </div>

                  <div className="card_sub_container">
                    {subscriptions.slice(Math.ceil(subscriptions.length / 2)).map(sub => (
                        <div key={sub.id} className="subscription_card">
                          <div className="description_sub">
                            <p className="month">
                              {sub.duration_days === 30 ? '1' : Math.floor(sub.duration_days / 30)}
                              <span>{formatDuration(sub.duration_days)}</span>
                            </p>
                            <p className="count">{formatPrice(sub.price)}/мес</p>
                            <ul>
                              <li>{sub.description || 'Расширенный набор тестов для качественной адаптации'}</li>
                            </ul>
                          </div>
                          <img
                              src="/img/sub.png"
                              alt="subscription"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/280x350?text=Subscription';
                              }}
                          />
                        </div>
                    ))}
                  </div>
                </div>
            )}
          </div>

          <Link to="/subscriptions" className="btn_to_sub">
            Оформить подписку
          </Link>

          <div className="tests">
            <div className="about_tests">
              <h3>Тестирование</h3>
              <p>
                ПРОЙДИТЕ НАШИ ТЕСТЫ И УЗНАЙТЕ КАКИЕ ТРЕНИРОВКИ
                ПОДХОДЯТ ИМЕННО ВАМ!
              </p>
            </div>

            {tests.length === 0 ? (
                <div className="empty_container">
                  <p>Тесты временно недоступны</p>
                </div>
            ) : (
                <TestSlider tests={tests} />
            )}
          </div>

          <Link to="/tests" className="btn_to_test">
            Перейти к тестированию
          </Link>
        </main>
        <Footer />
      </>
  );
};

export default HomePage;