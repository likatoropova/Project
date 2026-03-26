import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LogoutModal from '../LogoutModal';
import '../../styles/admin_header.scss';

const AdminHeader = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = async () => {
        setIsLogoutModalOpen(false);
        await logout();
        navigate('/login');
    };

    const handleCancelLogout = () => {
        setIsLogoutModalOpen(false);
    };

    const handleBackToAdmin = () => {
        navigate('/admin/dashboard');
    };

    return (
        <header>
            <div className="logo">
                <img src="/img/Logo.png" alt="Logo"/>
            </div>
            <div className="nav_buttons">
                <button className="back-to-admin" onClick={handleBackToAdmin}>
                    Вернуться в админ-панель
                </button>
                <button className="second_button" onClick={handleLogoutClick}>
                    Выход
                </button>
            </div>
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={handleCancelLogout}
                onConfirm={handleConfirmLogout}
            />
        </header>
    );
};

export default AdminHeader;