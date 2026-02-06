import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/header_footer.css';

const Header = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <header>
      <div className="logo">
        <img src="/img/logo.svg" alt="Logo" />
        <span>LOGOTYPE</span>
      </div>
      <div className="nav_links">
        <Link to="/">Главная</Link>
        <Link to="/trainings">Тренировки</Link>
      </div>
      <div className="nav_buttons">
        {!isLoginPage && (
          <Link to="/login" className={isRegisterPage ? "login" : ""}>
            Войти
          </Link>
        )}
        {!isRegisterPage && (
          <Link to="/register" className={isLoginPage ? "register" : ""}>
            Зарегистрироваться
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;