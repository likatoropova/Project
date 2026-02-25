import React, { useEffect, useRef, useState } from 'react';

const PasswordInput = ({ 
  id,
  name,
  placeholder = 'Введите пароль',
  required = true,
  onChange,
  onBlur,
  error = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleTogglePassword = () => {
    if (showPassword) {
      setShowPassword(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    setShowPassword(true);

    timerRef.current = setTimeout(() => {
      setShowPassword(false);
      timerRef.current = null;
    }, 5000);
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
    if (showPassword && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowPassword(false);
        timerRef.current = null;
      }, 5000);
    }
  };

  const handleBlur = (e) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className={`password_group ${error ? 'error' : ''}`}>
      <input
        type={showPassword ? 'text' : 'password'}
        name={name || id}
        id={id}
        placeholder={placeholder}
        required={required}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <img
        src={showPassword ? '/img/openPass.svg' : '/img/showPass.svg'}
        alt="Показать/скрыть пароль"
        onClick={handleTogglePassword}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
};

export default PasswordInput;