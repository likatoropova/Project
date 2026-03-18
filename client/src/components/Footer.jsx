import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header_footer.scss';

const Footer = () => {
  return (
    <footer>
      <div className="footer_links">
        <Link to="/consent">Пользовательское соглашение</Link>
        <Link to="/privacy">Политика конфиденциальности</Link>
        <Link to="/offer">Публичная оферта</Link>
      </div>
      <div className="logo">
        <img src="/img/logo.svg" alt="Logo" />
        <span>LOGOTYPE</span>
      </div>
      <div className="social_icons">
        <div>
          <p>Социальные сети:</p>
        </div>
        <div>
          <a href="#"><img src="/img/VK.svg" alt="VK" /></a>
          <a href="#"><img src="/img/Telegram.svg" alt="Telegram" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;