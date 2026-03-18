import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PasswordInput from '../components/PasswordInput';
import { useApi } from '../hooks/useApi';
import { resetPassword } from '../api/authAPI';
import { validators } from '../utils/validators';
import '../styles/confirmation_pass_style.scss';
import '../styles/form.scss';
import '../styles/fonts.scss';

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
  const [oldPasswordError, setOldPasswordError] = useState('');

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

  useEffect(() => {
    if (error) {
      console.log('API Error in password reset:', error);
      if (typeof error === 'object') {
        if (error.message && error.message.includes('совпадает со старым')) {
          setOldPasswordError('Новый пароль не должен совпадать со старым');
        } else if (error.password) {
          const passwordError = Array.isArray(error.password) ? error.password[0] : error.password;
          setValidationErrors(prev => ({
            ...prev,
            password: passwordError
          }));
        }
      } else if (typeof error === 'string' && error.includes('совпадает со старым')) {
        setOldPasswordError('Новый пароль не должен совпадать со старым');
      }
    }
  }, [error]);

  const validateField = (name, value) => {
    switch (name) {
      case 'password':
        return validators.password(value);
      case 'confirmPassword':
        return validators.passwordConfirmation(formData.password, value);
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
    if (oldPasswordError) {
      setOldPasswordError('');
    }
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
      if (name === 'password' && touchedFields.confirmPassword && formData.confirmPassword) {
        const confirmError = validators.passwordConfirmation(value, formData.confirmPassword);
        setValidationErrors(prev => ({
          ...prev,
          confirmPassword: confirmError
        }));
      }
    }
    if (oldPasswordError) {
      setOldPasswordError('');
    }
  };

  const validateForm = () => {
    const errors = {
      password: validators.password(formData.password),
      confirmPassword: validators.passwordConfirmation(formData.password, formData.confirmPassword)
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

    setOldPasswordError('');

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
      <main className="main_auth">
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Восстановление пароля</legend>
            <p className="politic">
              Придумайте новый пароль для вашего аккаунта
            </p>
            {error && !oldPasswordError && !validationErrors.password && (
              <div className="error_message">
                {getErrorMessage()}
              </div>
            )}
            
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