import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Timer from '../components/Timer';
import { useApi } from '../hooks/useApi';
import { verifyResetCode, forgotPassword } from '../api/authAPI';
import '../styles/restore_pass_style.css';
import '../styles/form.css';
import '../styles/fonts.css';

const RestorePassword = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [touched, setTouched] = useState(false);
  
  const { execute: executeVerify, loading: verifyLoading, error: verifyError } = useApi(verifyResetCode);
  const { execute: executeResend, loading: resendLoading } = useApi(forgotPassword);

  useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    if (!savedEmail) {
      navigate('/forgot-password');
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  const validateCode = (value) => {
    if (!value) return 'Введите код подтверждения';
    if (value.length !== 6) return 'Код должен содержать 6 символов';
    return '';
  };

  const handleBlur = (e) => {
    setTouched(true);
    const error = validateCode(code);
    setValidationError(error);
  };

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    const filtered = value.replace(/[^A-Z0-9]/g, '');
    if (filtered.length <= 6) {
      setCode(filtered);
      if (touched) {
        const error = validateCode(filtered);
        setValidationError(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched(true);
    const error = validateCode(code);
    setValidationError(error);
    
    if (error) return;

    const result = await executeVerify(email, code);

    if (result.success) {
      localStorage.setItem('resetCode', code);
      navigate('/confirm-password');
    }
  };

  const handleResendCode = async () => {
    const result = await executeResend(email);
    if (result.success) {
      setCode('');
      setTouched(false);
    }
  };

  const errorMessage = verifyError || validationError;

  return (
    <>
      <Header />
      <main>
        <div className="form_container">
          <form className="form_group" onSubmit={handleSubmit}>
            <legend>Восстановление пароля</legend>
            <p className="description" style={{ textAlign: 'center', marginBottom: '10px' }}>
              Введите код, отправленный на почту
            </p>
            <input
              type="text"
              name="code_input"
              id="code"
              placeholder="Введите код"
              required
              value={code}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={verifyLoading || resendLoading}
              maxLength={6}
              className={validationError && touched ? 'error' : ''}
              autoFocus
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
        </div>
        <img className="back" src="/img/bg-right.svg" alt="background" />
      </main>
      <Footer />
    </>
  );
};

export default RestorePassword;