import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PasswordInput from '../components/PasswordInput';
import { useApi } from '../hooks/useApi';
import { resetPassword } from '../api/authAPI';
import '../styles/confirmation_pass_style.css';
import '../styles/form.css';
import '../styles/fonts.css';

const ConfirmPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  const { execute: executeReset, loading, error } = useApi(resetPassword);

  useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    const savedCode = localStorage.getItem('resetCode');
    
    if (!savedEmail || !savedCode) {
      navigate('/forgot-password');
    } else {
      setEmail(savedEmail);
      setCode(savedCode);
    }
  }, [navigate]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Подтверждение пароля обязательно';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
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

    console.log('📤 Sending reset password request:', {
      email,
      code,
      password: formData.password,
      password_confirmation: formData.confirmPassword
    });

    const result = await executeReset(
      email,
      code,
      formData.password,
      formData.confirmPassword
    );

    if (result.success) {
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetCode');
      navigate('/login');
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return 'Произошла ошибка';
  };

  return (
    <>
      <Header />
      <main>
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Восстановление пароля</legend>
            
            {error && (
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
                {getErrorMessage()}
              </div>
            )}
            
            <p className="politic">
              Придумайте новый пароль для вашего аккаунта
            </p>
            
            <PasswordInput
              id="password"
              name="password"
              placeholder="Введите новый пароль"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {validationErrors.password && (
              <span className="field_error" style={{color: 'red', fontSize: '12px', display: 'block', marginTop: '5px'}}>
                {validationErrors.password}
              </span>
            )}
            
            <PasswordInput
              id="password_repeat"
              name="confirmPassword"
              placeholder="Повторите новый пароль"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            {validationErrors.confirmPassword && (
              <span className="field_error" style={{color: 'red', fontSize: '12px', display: 'block', marginTop: '5px'}}>
                {validationErrors.confirmPassword}
              </span>
            )}
            
            <button
              type="submit"
              className="butn"
              disabled={loading}
            >
              {loading ? 'Сохранение...' : 'Сохранить пароль'}
            </button>
          </form>
        </div>
        <img className="back" src="/img/bg-right.svg" alt="background" />
      </main>
      <Footer />
    </>
  );
};

export default ConfirmPassword;