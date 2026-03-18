import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LogoutModal from '../components/LogoutModal';
import '../styles/header_footer.scss';
import '../styles/fonts.scss'

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
    window.location.href = '/';
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <header>
      <div className="logo">
        <img src="/img/Logo.png" alt="Logo" />
      </div>
      <div className="nav_links">
        <Link to="/">Главная</Link>
        <Link to="/tests">Тесты</Link>
        <Link to="/subscriptions">Подписки</Link>
        {isAuthenticated && (
          <>
            <Link to="/trainings">Тренировки</Link>

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
            <Link to="/" onClick={handleLogoutClick} className="second_button">
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
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
};

export default Header;