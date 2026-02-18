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
  
  const { execute: executeVerify, loading: verifyLoading, error: verifyError } = useApi(verifyResetCode);
  const { execute: executeResend, loading: resendLoading } = useApi(forgotPassword);

  useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    if (!savedEmail) {
      // Если нет email, возвращаем на страницу запроса
      navigate('/forgot-password');
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  const validateCode = () => {
    if (!code) {
      setValidationError('Введите код подтверждения');
      return false;
    } else if (code.length !== 6) {
      setValidationError('Код должен содержать 6 символов');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    // Разрешаем только буквы и цифры
    const filtered = value.replace(/[^A-Z0-9]/g, '');
    if (filtered.length <= 6) {
      setCode(filtered);
      setValidationError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCode()) {
      return;
    }

    console.log('📤 Verifying reset code:', { email, code });

    const result = await executeVerify(email, code);

    console.log('📥 Verify result:', result);

    if (result.success) {
      // Сохраняем код для следующего шага
      localStorage.setItem('resetCode', code);
      navigate('/confirm-password');
    }
  };

  const handleResendCode = async () => {
    console.log('📤 Resending code to:', email);
    
    const result = await executeResend(email);
    
    if (result.success) {
      // Код отправлен, таймер сбросится автоматически
      console.log('✅ Code resent successfully');
      // Очищаем поле кода при повторной отправке
      setCode('');
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
            
            {errorMessage && (
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
                {errorMessage}
              </div>
            )}
            
            <p className="politic" style={{ textAlign: 'center', marginBottom: '10px' }}>
              Введите код, отправленный на почту
            </p>
            <input
              type="text"
              name="code"
              id="code"
              placeholder="Введите код"
              required
              value={code}
              onChange={handleChange}
              disabled={verifyLoading || resendLoading}
              maxLength={6}
              className="code_input"
              autoFocus
            />
            <button
              type="submit"
              className="butn"
              disabled={verifyLoading || resendLoading || code.length !== 6}
            >
              {verifyLoading ? 'Проверка...' : 'Отправить'}
            </button>
            <Timer 
              initialSeconds={300}
              onResend={handleResendCode}
              isResendDisabled={verifyLoading || resendLoading}
            />
          </form>
        </div>
        <img className="back" src="/img/bg-right.svg" alt="background" />
      </main>
      <Footer />
    </>
  );
};

export default RestorePassword;