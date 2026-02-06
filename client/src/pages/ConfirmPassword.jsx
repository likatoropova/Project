import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PasswordInput from '../components/PasswordInput';
import '../styles/confirmation_pass_style.css';
import '../styles/form.css';
import '../styles/fonts.css';

const ConfirmPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Проверка совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    // Логика установки нового пароля
    console.log('Новый пароль:', formData.password);
  };

  return (
    <>
      <Header />
      <main>
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Восстановление пароля</legend>
            
            <PasswordInput
              id="password"
              name="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleChange}
            />
            
            <PasswordInput
              id="password_repeat"
              name="confirmPassword"
              placeholder="Повторите пароль"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            
            <input
              type="submit"
              name="button"
              value="Подтвердить"
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

export default ConfirmPassword;