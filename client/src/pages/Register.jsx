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
  const [touchedFields, setTouchedFields] = useState({});

  const validateEmail = (email) => {
    if (!email) return 'Email обязателен';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Введите корректный email';
    }
    return '';
  };

  const validateName = (name) => {
    if (!name) return 'Имя обязательно';
    if (name.trim().length < 2) return 'Имя должно содержать минимум 2 символа';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Пароль обязателен';
    if (password.length < 6) return 'Пароль должен содержать минимум 6 символов';
    if (password.length > 12) return 'Пароль должен содерждать не больше 12 символов'
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return validateEmail(value);
      case 'name':
        return validateName(value);
      case 'password':
        return validatePassword(value);
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
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
    
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
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

  const validateForm = () => {
    const errors = {
      email: validateEmail(formData.email),
      name: validateName(formData.name),
      password: validatePassword(formData.password)
    };
    
    setValidationErrors(errors);
    setTouchedFields({
      email: true,
      name: true,
      password: true
    });
    
    return !errors.email && !errors.name && !errors.password;
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
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Введите email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={validationErrors.email && touchedFields.email ? 'error' : ''}
            />
            {validationErrors.email && touchedFields.email && (
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
              onBlur={handleBlur}
              disabled={loading}
              className={validationErrors.name && touchedFields.name ? 'error' : ''}
            />
            {validationErrors.name && touchedFields.name && (
              <span className="field_error">{validationErrors.name}</span>
            )}
            <PasswordInput
              id="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              error={validationErrors.password && touchedFields.password}
            />
            {validationErrors.password && touchedFields.password && (
              <span className="field_error">{validationErrors.password}</span>
            )}
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