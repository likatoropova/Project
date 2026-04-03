// src/components/profile/PasswordChangeModal.jsx

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useProfile } from '../../hooks/useProfile';
import '../../styles/password_change_modal.scss';

const PasswordChangeModal = ({ isOpen, onClose }) => {
    const { updateUserPassword } = useProfile();
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
        setError('');
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.old_password) {
            errors.old_password = 'Введите текущий пароль';
        }
        if (!formData.new_password) {
            errors.new_password = 'Введите новый пароль';
        } else if (formData.new_password.length < 8) {
            errors.new_password = 'Пароль должен содержать не менее 8 символов';
        }
        if (formData.new_password !== formData.new_password_confirmation) {
            errors.new_password_confirmation = 'Пароли не совпадают';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        const result = await updateUserPassword(formData);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFormData({
                    old_password: '',
                    new_password: '',
                    new_password_confirmation: ''
                });
            }, 1500);
        } else {
            setError(result.error || 'Ошибка смены пароля');
        }

        setLoading(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <div className="modal_overlay" onClick={handleOverlayClick}>
            <div className="password_change_modal_content" onClick={(e) => e.stopPropagation()}>
                <h3>Смена пароля</h3>
                <form className="modal_form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    {success && (
                        <div className="success-message">Пароль успешно изменен!</div>
                    )}

                    <div className="form_group_password_change">
                        <input
                            type="password"
                            id="old_password"
                            name="old_password"
                            value={formData.old_password}
                            onChange={handleInputChange}
                            className={validationErrors.old_password ? 'error' : ''}
                            placeholder="Старый пароль"
                        />
                        {validationErrors.old_password && (
                            <span className="field-error">{validationErrors.old_password}</span>
                        )}
                    </div>

                    <div className="form_group_password_change">
                        <input
                            type="password"
                            id="new_password"
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleInputChange}
                            className={validationErrors.new_password ? 'error' : ''}
                            placeholder="Новый пароль"
                        />
                        {validationErrors.new_password && (
                            <span className="field-error">{validationErrors.new_password}</span>
                        )}
                    </div>

                    <div className="form_group_password_change">
                        <input
                            type="password"
                            id="new_password_confirmation"
                            name="new_password_confirmation"
                            value={formData.new_password_confirmation}
                            onChange={handleInputChange}
                            className={validationErrors.new_password_confirmation ? 'error' : ''}
                            placeholder="Подтверждение пароля"
                        />
                        {validationErrors.new_password_confirmation && (
                            <span className="field-error">{validationErrors.new_password_confirmation}</span>
                        )}
                    </div>

                    <div className="modal_actions">
                        <button
                            type="submit"
                            className="btn-confirm"
                            disabled={loading || success}
                        >
                            {loading ? 'Сохранение...' : 'Сменить пароль'}
                        </button>
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Отменить
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default PasswordChangeModal;