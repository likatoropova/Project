import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/header_footer.css';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header>
      <div className="logo">
        <img src="/img/logo.svg" alt="Logo" />
        <span>LOGOTYPE</span>
      </div>
      <div className="nav_links">
        <Link to="/">Главная</Link>
        <Link to="/trainings">Тренировки</Link>
        {isAuthenticated && (
          <>
            <Link to="/subscriptions">Подписки</Link>
            <Link to="/tests">Тесты</Link>
          </>
        )}
      </div>
      <div className="nav_buttons">
        {isAuthenticated ? (
          <>
            <Link className='notifications'>
              <img src="/img/notifications.svg" alt="notifications" />
            </Link>
            <Link to="/profile" className="profile-btn">
              <span>Профиль</span>
            </Link>
            <Link to="/" onClick={handleLogout} className="second_button">
              Выйти
            </Link>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className={isRegisterPage ? "login" : "toLogin"}
            >
              Войти
            </Link>
            <Link 
              to="/register" 
              className={isLoginPage ? "second_button" : "second_button"}
            >
              Зарегистрироваться
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;