import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PasswordInput from '../components/PasswordInput';
import { useApi } from '../hooks/useApi';
import { login } from '../api/authAPI';
import { validators } from '../utils/validators';
import '../styles/auth_style.scss';
import '../styles/form.scss';
import '../styles/fonts.scss';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { execute: executeLogin, loading, error: apiError } = useApi(login);
  const { login: authLogin, isAuthenticated, hasUserParams, user } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User logged in, user.role_id:', user?.role_id);

      // Используем прямую проверку user.role_id
      if (user?.role_id === 1) {
        console.log('Admin user detected, redirecting to admin dashboard');
        navigate('/admin/dashboard');
      } else if (!hasUserParams) {
        navigate('/training-goal');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, hasUserParams, navigate]);

  useEffect(() => {
    if (apiError) {
      console.log('API Error:', apiError);

      if (apiError.errors) {
        setFieldErrors(apiError.errors);
      } else if (typeof apiError === 'object') {
        const fieldSpecificErrors = {};
        if (apiError.email) fieldSpecificErrors.email = apiError.email;
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
      case 'password':
        return validators.password(value);
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

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
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
    }

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {
      email: validators.email(formData.email),
      password: validators.password(formData.password)
    };

    setValidationErrors(errors);
    setTouchedFields({
      email: true,
      password: true
    });

    return !errors.email && !errors.password;
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
      await authLogin(formData.email.trim(), formData.password);
      // Редирект произойдет в useEffect после обновления состояния
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
              <legend>Авторизация</legend>
              {apiError && !Object.keys(fieldErrors).length && (
                  <div className="error_message">{apiError}</div>
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
                  className={(validationErrors.email && touchedFields.email) || fieldErrors.email ? 'error' : ''}
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