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
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { execute: executeLogin, loading, error } = useApi(login);
  const { login: authLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const validatePassword = (password) => {
    if (!password) return 'Пароль обязателен';
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return validateEmail(value);
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
    setValidationErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    };
    setValidationErrors(errors);
    setTouchedFields({ email: true, password: true });
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await executeLogin(
      formData.email.trim(),
      formData.password
    );
    
    if (result.success) {
      await authLogin(formData.email.trim(), formData.password);
      navigate('/');
    }
  };

  return (
    <>
      <Header />
      <main className="main_auth">
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Авторизация</legend>
            {error && (
              <div className="error_message">
                {error}
              </div>
            )}
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
            {validationErrors.email && (
              <span className="field_error">{validationErrors.email}</span>
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