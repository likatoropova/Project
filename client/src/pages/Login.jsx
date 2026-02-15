// pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PasswordInput from '../components/PasswordInput';
import { useApi } from '../hooks/useApi';
import { login } from '../api/authAPI';
import '../styles/auth_style.css';
import '../styles/form.css';
import '../styles/fonts.css';

const Login = () => {
  const navigate = useNavigate();
  const { execute: executeLogin, loading, error } = useApi(login);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Введите корректный email';
    }
    
    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await executeLogin(
      formData.email.trim(),
      formData.password
    );

    if (result.success) {
      // Перенаправляем на главную страницу или дашборд
      navigate('/');
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Авторизация</legend>
            
            {error && (
              <div className="error_message">
                {error}
              </div>
            )}
            
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Введите email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className={validationErrors.email ? 'error' : ''}
            />
            {validationErrors.email && (
              <span className="field_error">{validationErrors.email}</span>
            )}
            
            <PasswordInput
              id="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {validationErrors.password && (
              <span className="field_error">{validationErrors.password}</span>
            )}
            
            <Link to="/forgot-password" className="forgot_pass">
              Забыли пароль?
            </Link>
            
            <button
              type="submit"
              className="butn_for_login"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
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