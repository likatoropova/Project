import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/register_code_style.css';
import '../styles/form.css';
import '../styles/fonts.css';

const RegisterCode = () => {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика проверки кода
    console.log('Код подтверждения:', code);
  };

  return (
    <>
      <Header />
      <main>
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Регистрация</legend>
            <p className="politic">
              Введите код из письма, чтобы подтвердить вашу почту
              и завершить регистрацию
            </p>
            <input
              type="text"
              name="code"
              id="code"
              placeholder="Введите код"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
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

export default RegisterCode;