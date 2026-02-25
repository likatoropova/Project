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
  const [touched, setTouched] = useState(false);

  
  const { execute: executeForgot, loading, error } = useApi(forgotPassword);

  const validateEmail = (value) => {
    if (!value) return 'Email обязателен';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Введите корректный email';
    }
    return '';
  };

  const handleBlur = (e) => {
    setTouched(true);
    const error = validateEmail(email);
    setValidationError(error);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (touched) {
      const error = validateEmail(e.target.value);
      setValidationError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched(true);
    const error = validateEmail(email);
    setValidationError(error);
    
    if (error) return;

    const result = await executeForgot(email);

    if (result.success) {
      localStorage.setItem('resetEmail', email);
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
            
            <p className="description">
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
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={validationError && touched ? 'error' : ''}
            />
            {validationError && touched && (
              <span className="field_error">{validationError}</span>
            )}
            
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