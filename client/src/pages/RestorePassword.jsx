import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/restore_pass_style.css';
import '../styles/form.css';
import '../styles/fonts.css';

const RestorePassword = () => {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика проверки кода восстановления
    console.log('Код восстановления:', code);
  };

  return (
    <>
      <Header />
      <main>
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Восстановление пароля</legend>
            <p className="politic">
              Введите код, отправленный на почту
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

export default RestorePassword;