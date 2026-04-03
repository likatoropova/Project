// src/components/profile/ProfileEditModal.jsx

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useProfile } from '../../hooks/useProfile';
import '../../styles/profile_edit_modal.scss';

const ProfileEditModal = ({ isOpen, onClose, user }) => {
    const { updateUserProfile, uploadUserAvatar } = useProfile();
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                name: user.name || '',
                email: user.email || ''
            });
            setAvatarPreview(user.avatar_url || '');
            setError('');
            setValidationErrors({});
            setAvatarFile(null);
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) {
            errors.name = 'Введите имя';
        }
        if (!formData.email.trim()) {
            errors.email = 'Введите email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Введите корректный email';
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

        try {
            // Обновляем профиль
            const profileResult = await updateUserProfile({
                name: formData.name,
                email: formData.email
            });

            if (!profileResult.success) {
                setError(profileResult.error || 'Ошибка обновления профиля');
                setLoading(false);
                return;
            }

            // Загружаем аватар если есть
            if (avatarFile) {
                setUploadingAvatar(true);
                const avatarResult = await uploadUserAvatar(avatarFile);
                setUploadingAvatar(false);
                if (!avatarResult.success) {
                    console.warn('Avatar upload failed:', avatarResult.error);
                }
            }

            onClose();
        } catch (err) {
            setError('Произошла ошибка при сохранении');
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <div className="modal_overlay" onClick={handleOverlayClick}>
            <div className="profile_edit_modal_content" onClick={(e) => e.stopPropagation()}>
                <form className="modal_form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">{error}</div>
                    )}
                    <div className="form_group_modal">
                        <label htmlFor="email_user">Введите email</label>
                        <input
                            type="email"
                            id="email_user"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={validationErrors.email ? 'error' : ''}
                            placeholder="email@example.com"
                        />
                        {validationErrors.email && (
                            <span className="field-error">{validationErrors.email}</span>
                        )}
                    </div>
                    <div className="form_group_modal">
                        <label htmlFor="name_user">Введите имя</label>
                        <input
                            type="text"
                            id="name_user"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={validationErrors.name ? 'error' : ''}
                            placeholder="Иван Иванов"
                        />
                        {validationErrors.name && (
                            <span className="field-error">{validationErrors.name}</span>
                        )}
                    </div>
                    <div className="modal-buttons">
                        <button
                            type="submit"
                            className="btn-confirm"
                            disabled={loading}
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
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
                <div className="avatar_edit_section">
                    <div className="avatar_preview_wrapper">
                        <img
                            src={avatarPreview || '/img/default-avatar.png'}
                            alt="Avatar preview"
                            className="avatar_preview"
                        />
                    </div>
                    <div className="avatar_upload_btn_cont">
                        <p>Загрузить файл:</p>
                        <button type="button" className="upload_btn_avatar"
                                onClick={() => document.getElementById('avatarInput').click()}>
                            +
                        </button>
                    </div>
                    <p className="format">jpg формат</p>
                </div>

                <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{display: 'none'}}
                />
            </div>
        </div>,
        document.body
    );
};

export default ProfileEditModal;