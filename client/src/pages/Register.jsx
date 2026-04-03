import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PasswordInput from '../components/PasswordInput';
import Notification from '../components/NotificationReg';
import { useApi } from '../hooks/useApi';
import { register } from '../api/authAPI';
import { useFirstTest } from '../context/FirstTestContext';
import '../styles/register_style.scss';
import '../styles/form.scss';
import '../styles/fonts.scss';
import { validators } from '../utils/validators';

const Register = () => {
  const navigate = useNavigate();
  const { resetGuest } = useFirstTest();
  const { execute: executeRegister, loading, error: apiError } = useApi(register);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    password_confirmation: '',
    agree: false
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    document.title = 'Регистрация';
    const guestId = localStorage.getItem('guestId');
    if (guestId) {
      console.log('🆔 Guest ID present before registration:', guestId);
    }
  }, []);

  // Обработка ошибок от API
  useEffect(() => {
    if (apiError) {
      console.log('API Error:', apiError);
      
      if (apiError.errors) {
        setFieldErrors(apiError.errors);
      } else if (typeof apiError === 'object') {
        const fieldSpecificErrors = {};
        if (apiError.email) fieldSpecificErrors.email = apiError.email;
        if (apiError.name) fieldSpecificErrors.name = apiError.name;
        if (apiError.password) fieldSpecificErrors.password = apiError.password;
        
        if (Object.keys(fieldSpecificErrors).length > 0) {
          setFieldErrors(fieldSpecificErrors);
        }
      }
    }
  }, [apiError]);

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return validators.email(value);
      case 'name':
        return validators.name(value);
      case 'password':
        return validators.password(value);
      case 'agree':
        return validators.agreement(value);
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, fieldValue);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));
    
    if (touchedFields[name]) {
      const error = validateField(name, fieldValue);
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

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
      email: validators.email(formData.email),
      name: validators.name(formData.name),
      password: validators.password(formData.password),
      agree: validators.agreement(formData.agree)
    };
    
    setValidationErrors(errors);
    setTouchedFields({
      email: true,
      name: true,
      password: true,
      agree: true
    });
    
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const guestId = localStorage.getItem('guestId');
    console.log('Guest ID before registration:', guestId);
    
    const result = await executeRegister(
      formData.email.trim(),
      formData.name.trim(),
      formData.password
    );

    if (result?.success) {
      console.log('Registration successful');
      resetGuest();
      localStorage.removeItem('guestId');
      localStorage.removeItem('guestParamsCompleted');
      localStorage.setItem('registrationEmail', formData.email);
      
      setTimeout(() => {
        navigate('/register-code');
      }, 200);
    }
  };

  const getFieldErrorMessage = (fieldName) => {
    if (validationErrors[fieldName] && touchedFields[fieldName]) {
      return validationErrors[fieldName];
    }
    if (fieldErrors[fieldName]) {
      if (Array.isArray(fieldErrors[fieldName])) {
        return fieldErrors[fieldName][0];
      }
      return fieldErrors[fieldName];
    }
    return null;
  };
  
  return (
      <>
        <Header />
        <main className="main_auth">
          <div className="form_container">
            <form className="form_group" onSubmit={handleSubmit}>
              <legend>Регистрация</legend>
              {apiError && !Object.keys(fieldErrors).length && typeof apiError === 'string' && (
                <div className="error_message">{apiError}</div>
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
                  className={(validationErrors.email && touchedFields.email) || fieldErrors.email ? 'error' : ''}
              />
              {getFieldErrorMessage('name') && (
                <span className="field_error">{getFieldErrorMessage('name')}</span>
              )}
              <input
                  type="text"
                  name="email"
                  id="email-reg"
                  placeholder="Введите email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={(validationErrors.name && touchedFields.name) || fieldErrors.name ? 'error' : ''}
              />
              {getFieldErrorMessage('email') && (
                <span className="field_error">{getFieldErrorMessage('email')}</span>
              )}
              <PasswordInput
                  id="password"
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  error={(validationErrors.password && touchedFields.password) || fieldErrors.password}
              />
              {getFieldErrorMessage('password') && (
                <span className="field_error">{getFieldErrorMessage('password')}</span>
              )}
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
                    <Link to="/privacy" className="politic_link">
                      Политикой конфиденциальности
                    </Link> и даю{' '}
                    <Link to="/consent">
                      Соглисие на обработку персональных данных
                    </Link>
                </label>
              </div>
              {getFieldErrorMessage('agree') && (
                <span className="field_error">{getFieldErrorMessage('agree')}</span>
              )}

              <input
                  type="submit"
                  name="button"
                  value={loading ? 'Регистрация...' : 'Зарегистрироваться'}
                  className="butn-reg"
                  disabled={loading}
              />
              <div className="to_login">
                <p>Уже есть аккаунт?</p>
              <Link to="/login">Войти</Link>
            </div>
            </form>
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