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
  const [touchedFields, setTouchedFields] = useState({});
  
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

   const validatePassword = (password) => {
    if (!password) return 'Пароль обязателен';
    if (password.length < 6) return 'Пароль должен содержать минимум 6 символов';
    return '';
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return 'Подтверждение пароля обязательно';
    if (formData.password !== confirmPassword) return 'Пароли не совпадают';
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return validateConfirmPassword(value);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }));
      
      // При изменении пароля, проверяем и подтверждение если оно было заполнено
      if (name === 'password' && touchedFields.confirmPassword && formData.confirmPassword) {
        const confirmError = validateConfirmPassword(formData.confirmPassword);
        setValidationErrors(prev => ({
          ...prev,
          confirmPassword: confirmError
        }));
      }
    }
  };

  const validateForm = () => {
    const errors = {
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword)
    };
    
    setValidationErrors(errors);
    setTouchedFields({
      password: true,
      confirmPassword: true
    });
    
    return !errors.password && !errors.confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
            <p className="politic">
              Придумайте новый пароль для вашего аккаунта
            </p>
            
            <PasswordInput
              id="password"
              name="password"
              placeholder="Введите новый пароль"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              error={validationErrors.password && touchedFields.password}
            />
            {validationErrors.password && touchedFields.password && (
              <span className="field_error">{validationErrors.password}</span>
            )}
            
            <PasswordInput
              id="password_repeat"
              name="confirmPassword"
              placeholder="Повторите новый пароль"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              error={validationErrors.confirmPassword && touchedFields.confirmPassword}
            />
            {validationErrors.confirmPassword && touchedFields.confirmPassword && (
              <span className="field_error">{validationErrors.confirmPassword}</span>
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