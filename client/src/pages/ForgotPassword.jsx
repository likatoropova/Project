import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/forgot_password_style.css';
import '../styles/form.css';
import '../styles/fonts.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика отправки кода восстановления
    console.log('Email для восстановления:', email);
  };

  return (
    <>
      <Header />
      <main>
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Забыли пароль?</legend>
            <p className="politic">
              Введите email, который вы использовали при регистрации, 
              мы отправим вам код для сброса пароля
            </p>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Введите email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="submit"
              name="button"
              value="Отправить"
              className="butn"
            />
          </form>
        </div>
        <img className="back" src="/img/bg-right.svg" alt="background" />
      </main>
      <Footer />
    </>
  );
};

export default ForgotPassword;