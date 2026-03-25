// pages/RegisterCode.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Timer from '../components/Timer';
import { useApi } from '../hooks/useApi';
import { verifyEmail, resendVerificationCode } from '../api/authAPI';
import { validators } from '../utils/validators';
import '../styles/register_code_style.scss';
import '../styles/form.scss';
import '../styles/fonts.scss';

const RegisterCode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [touched, setTouched] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const { execute: executeVerify, loading: verifyLoading, error: verifyError } = useApi(verifyEmail);
  const { execute: executeResend, loading: resendLoading } = useApi(resendVerificationCode);

  useEffect(() => {
    const savedEmail = localStorage.getItem('registrationEmail');
    if (!savedEmail) {
      navigate('/register');
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  useEffect(() => {
    document.title = 'Подтвердите email';
    if (verifyError) {
      if (verifyError.errors?.code) {
        setFieldError(verifyError.errors.code[0]);
      } else if (verifyError.message) {
        setFieldError(verifyError.message);
      }
    }
  }, [verifyError]);

  const handleBlur = () => {
    setTouched(true);
    const error = validators.verificationCode(code);
    setValidationError(error);
    if (fieldError) setFieldError('');
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Только цифры
    if (value.length <= 6) {
      setCode(value);
      if (touched) {
        const error = validators.verificationCode(value);
        setValidationError(error);
      }
    }
    if (fieldError) setFieldError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched(true);
    const error = validators.verificationCode(code);
    setValidationError(error);
    
    if (error) return;

    const result = await executeVerify(email, code);

    if (result.success) {
      localStorage.removeItem('registrationEmail');
      navigate('/login');
    }
  };

  const handleResendCode = async () => {
    const result = await executeResend(email);
    if (result.success) {
      setCode('');
      setTouched(false);
      setValidationError('');
      setFieldError('');
    }
  };

  const displayError = validationError || fieldError;

  return (
    <>
      <Header />
      <main className="main_auth">
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Регистрация</legend>

            <p className="description-text">
              Введите код из письма, чтобы подтвердить вашу почту<br />
              и завершить регистрацию
            </p>
            {displayError && (
              <div className="error_message">{displayError}</div>
            )}
            <input
              type="text"
              name="code"
              placeholder="Введите код"
              value={code}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={verifyLoading || resendLoading}
              maxLength={6}
              id='code'
             className={displayError ? 'error' : ''}
            />
            {validationError && touched && (
              <span className="field_error">{validationError}</span>
            )}
            
            <Timer 
              initialSeconds={300}
              onResend={handleResendCode}
              isResendDisabled={verifyLoading || resendLoading}
            />
            
            <button
              type="submit"
              className="butn"
              disabled={verifyLoading || resendLoading || code.length !== 6}
            >
              {verifyLoading ? 'Проверка...' : 'Отправить'}
            </button>
          </form>
          
          <div className="to_login">
            <p>Уже есть аккаунт?</p>
            <Link to="/login">Войти</Link>
          </div>
        </div>
        <img className="back" src="/img/bg-right.svg" alt="background" />
      </main>
      <Footer />
    </>
  );
};

export default RegisterCode;