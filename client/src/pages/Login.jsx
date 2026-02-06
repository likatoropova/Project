import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PasswordInput from '../components/PasswordInput';
import '../styles/auth_style.css';
import '../styles/form.css';
import '../styles/fonts.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    // Здесь будет логика отправки данных на сервер
    console.log('Login data:', formData);
  };

  return (
    <>
      <Header />
      <main>
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Авторизация</legend>
            
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Введите email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            
            <PasswordInput
              id="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleChange}
            />
            
            <Link to="/forgot-password" className="forgot_pass">
              Забыли пароль?
            </Link>
            
            <input
              type="submit"
              name="button"
              value="Войти"
              className="butn_for_login"
            />
          </form>
          
          <div className="to_registration">
            <p>Ещё нет аккаунта?</p>
            <Link to="/register">Зарегистрироваться</Link>
          </div>
        </div>
        <img className="back" src="/img/bg-right.svg" alt="background" />
      </main>
      <Footer />
    </>
  );
};

export default Login;