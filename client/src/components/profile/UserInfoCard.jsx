import React, { useState } from 'react';
import '../../styles/user_info_card.scss';

const UserInfoCard = ({ user, onEditProfile, onChangePassword }) => {
    const [avatarPreview, setAvatarPreview] = useState(null);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Здесь вызов API для загрузки аватара
            // await uploadUserAvatar(file);
        }
    };

    return (
        <div className="user_info_card">
            <div className="user_avatar_section">
                <div className="avatar_wrapper">
                    <img
                        src={avatarPreview || user?.avatar_url || '/img/default-avatar.png'}
                        alt={user?.name}
                        className="user_avatar"
                    />
                    <label className="avatar_upload_btn">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>
                <h3 className="user_name">{user?.name}</h3>
                <p className="user_email">{user?.email}</p>
            </div>
            <div className="user_actions">
                <button className="btn_primary" onClick={onEditProfile}>
                    Редактировать профиль
                </button>
                <button className="btn_secondary" onClick={onChangePassword}>
                    Сменить пароль
                </button>
            </div>
        </div>
    );
};

export default UserInfoCard;