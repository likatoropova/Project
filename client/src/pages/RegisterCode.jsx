// pages/RegisterCode.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Timer from '../components/Timer';
import { useApi } from '../hooks/useApi';
import { verifyEmail, resendVerificationCode } from '../api/authAPI';
import '../styles/register_code_style.css';
import '../styles/form.css';
import '../styles/fonts.css';

const RegisterCode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  
  const { execute: executeVerify, loading: verifyLoading, error: verifyError } = useApi(verifyEmail);
  const { execute: executeResend, loading: resendLoading, error: resendError } = useApi(resendVerificationCode);

  useEffect(() => {
    const savedEmail = localStorage.getItem('registrationEmail');
    
    if (!savedEmail) {
      // Просто перенаправляем без уведомления
      navigate('/register');
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 6) {
      setCode(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      return;
    }

    const result = await executeVerify(email, code);

    if (result.success) {
      localStorage.removeItem('registrationEmail');
      navigate('/login');
    }
  };

  const handleResendCode = async () => {
    await executeResend(email);
  };

  const errorMessage = verifyError || resendError;

  return (
    <>
      <Header />
      <main>
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Регистрация</legend>

            <p className="politic">
              Введите код из письма, чтобы подтвердить вашу почту<br />
              и завершить регистрацию
            </p>
            
            {errorMessage && (
              <div className="error_message">{errorMessage}</div>
            )}
            
            <input
              type="text"
              name="code"
              placeholder="Введите код"
              value={code}
              onChange={handleChange}
              disabled={verifyLoading || resendLoading}
              maxLength={6}
              id='code'
            />
            
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