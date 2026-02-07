import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PasswordInput from '../components/PasswordInput';
import '../styles/register_style.css';
import '../styles/form.css';
import '../styles/fonts.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    agree: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agree) {
      alert('Необходимо согласие на обработку персональных данных');
      return;
    }
    // Здесь будет логика отправки данных на сервер
    console.log('Register data:', formData);
  };

  return (
    <>
      <Header />
      <main>
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Регистрация</legend>
            
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Введите email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Введите имя"
              required
              value={formData.name}
              onChange={handleChange}
            />
            
            <PasswordInput
              id="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleChange}
            />
            
            <p className="politic">
              Нажимая на кнопку "Зарегистрироваться", вы соглашаетесь с условиями
              <Link to="#" className="politic_link">
              Политики конфиденциальности
              </Link>
            </p>
            
            <div className="personal_data">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
              />
              <label htmlFor="agree">
                Я согласен с{' '}
                <Link to="#">
                  условиями обработки персональных данных
                </Link>
              </label>
            </div>
            
            <input
              type="submit"
              name="button"
              value="Зарегистрироваться"
              className="butn"
            />
          </form>
          
          <div className="to_login">
            <p>Уже есть аккаунт?</p>
            <Link to="/login">Войти</Link>
          </div>
        </div>
        <img className="back" src="/img/bg-right.svg" alt="background" />
      </main>
      <Footer />
    </>
  );
};

export default Register;