import React, { useState } from 'react';

const PasswordInput = ({ 
  id,
  name,
  placeholder = 'Введите пароль',
  required = true,
  onChange,
  value
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password_group">
      <input
        type={showPassword ? 'text' : 'password'}
        name={name || id}
        id={id}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        value={value}
      />
      <img
        src={showPassword ? '/img/openPass.svg' : '/img/showPass.svg'}
        alt="Показать/скрыть пароль"
        onClick={togglePasswordVisibility}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
};

export default PasswordInput;