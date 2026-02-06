import React from 'react';
import '../styles/header_footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer_links">
        <a href="#">Информация о тренировках</a>
        <a href="#">Политика конфиденциальности</a>
      </div>
      <div className="logo">
        <img src="/img/logo.svg" alt="Logo" />
        <span>LOGOTYPE</span>
      </div>
      <div className="social_icons">
        <div>
          <img src="/img/Icons.svg" alt="Telegram" />
          <p>Telegram</p>
        </div>
        <div>
          <img src="/img/Icons.svg" alt="VK" />
          <p>VK</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;