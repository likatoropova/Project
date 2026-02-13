import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PasswordInput from '../components/PasswordInput';
import Notification from '../components/NotificationReg';
import { useApi } from '../hooks/useApi';
import { register } from '../api/authApi';
import '../styles/register_style.css';
import '../styles/form.css';
import '../styles/fonts.css';

const Register = () => {
  const navigate = useNavigate();
  const { execute: executeRegister, loading, error } = useApi(register);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    agree: false
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    // Валидация email
    if (!formData.email) {
      errors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Введите корректный email';
    }
    
    // Валидация имени
    if (!formData.name) {
      errors.name = 'Имя обязательно';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Имя должно содержать минимум 2 символа';
    }
    
    // Валидация пароля
    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const [notification, setNotification] = useState({
    show: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const showNotification = (message) => {
    setNotification({
      show: true,
      message: message
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({
      ...prev,
      show: false
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree) {
      showNotification('Необходимо согласие на обработку персональных данных');
      return;
    }

    if (!validateForm()) {
      return;
    }

    const registrationData = {
      email: formData.email.trim(),
      name: formData.name.trim(),
      password: formData.password,
    };

    console.log('Sending registration data:', registrationData);
    if (!registrationData.name) {
      showNotification('Имя не может быть пустым');
      return;
    }

    const result = await executeRegister(
      formData.email.trim(),
      formData.name.trim(),
      formData.password
  );

    if (result.success) {
      localStorage.setItem('registrationEmail', formData.email);
      
      setTimeout(() => {
        navigate('/register-code');
      }, 200);
    }
    
    console.log('Register data:', formData);
  };

  return (
    <>
      <Header />
      <main>
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Регистрация</legend>
            {error && <div className="error_message">{error}</div>}
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
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Введите имя"
              required
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className={validationErrors.name ? 'error' : ''}
            />
            {validationErrors.name && (
              <span className="field_error">{validationErrors.name}</span>
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
            <p className="politic">
              Нажимая на кнопку "Зарегистрироваться", вы соглашаетесь с условиями
            </p>
            
            <Link to="#" className="politic_link">
              Политики конфиденциальности
            </Link>
            
            <div className="personal_data">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                disabled={loading}
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
              value={loading ? 'Регистрация...' : 'Зарегистрироваться'}
              className="butn"
              disabled={loading}
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
      
      {notification.show && (
        <Notification
          message={notification.message}
          duration={5000}
          onClose={closeNotification}
        />
      )}
    </>
  );
};

export default Register;