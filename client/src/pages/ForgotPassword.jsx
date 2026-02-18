import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useApi } from '../hooks/useApi';
import { forgotPassword } from '../api/authAPI';
import '../styles/forgot_password_style.css';
import '../styles/form.css';
import '../styles/fonts.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const { execute: executeForgot, loading, error } = useApi(forgotPassword);

  const validateEmail = () => {
    if (!email) {
      setValidationError('Email обязателен');
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Введите корректный email');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    console.log('📤 Sending forgot password request for email:', email);

    const result = await executeForgot(email);

    console.log('📥 Forgot password result:', result);

    if (result.success) {
      // Сохраняем email для следующих шагов
      localStorage.setItem('resetEmail', email);
      // Переходим на страницу ввода кода
      navigate('/restore-password');
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Забыли пароль?</legend>
            
            {(error || validationError) && (
              <div className="error_message" style={{
                color: '#721c24',
                padding: '12px',
                marginBottom: '20px',
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '4px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {validationError || error}
              </div>
            )}
            
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
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationError('');
              }}
              disabled={loading}
              className={validationError ? 'error' : ''}
            />
            
            <button
              type="submit"
              className="butn"
              disabled={loading}
              style={{
                opacity: loading ? 0.65 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Отправка...' : 'Отправить'}
            </button>
          </form>
        </div>
        <img className="back" src="/img/bg-right.svg" alt="background" />
      </main>
      <Footer />
    </>
  );
};

export default ForgotPassword;