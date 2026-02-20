import React from 'react';
import '../styles/header_footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer_links">
        <a href="#">Информация о тренировках</a>
        <a href="#">Политика конфиденциальности</a>
        <a href="#">Публичная оферта</a>
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