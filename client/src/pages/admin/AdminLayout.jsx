import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/admin/admin_layout.scss';
import LogoutModal from "../../components/LogoutModal.jsx";

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user, isAuthenticated } = useAuth();
    const [activeMenu, setActiveMenu] = useState('');
    const hasRedirected = useRef(false);
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

    // Защита на уровне лейаута
    useEffect(() => {
        // Проверяем авторизацию
        if (!isAuthenticated) {
            if (!hasRedirected.current) {
                hasRedirected.current = true;
                console.log('AdminLayout: Not authenticated, redirecting to login');
                navigate('/login');
            }
            return;
        }

        // Проверяем роль админа
        if (user && user?.role_id !== 1) {
            if (!hasRedirected.current) {
                hasRedirected.current = true;
                console.log('AdminLayout: Non-admin user, redirecting to home');
                navigate('/');
            }
            return;
        }

        // Если все хорошо, сбрасываем флаг
        hasRedirected.current = false;
    }, [isAuthenticated, user, navigate]);

    // Определяем активный пункт меню
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/admin/dashboard')) {
            setActiveMenu('dashboard');
        } else if (path.includes('/admin/tests')) {
            setActiveMenu('tests');
        } else if (path.includes('/admin/workouts')) {
            setActiveMenu('workouts');
        } else if (path.includes('/admin/subscriptions')) {
            setActiveMenu('subscriptions');
        } else if (path.includes('/admin/tags')) {
            setActiveMenu('tags');
        } else if (path.includes('/admin/exercises')) {
            setActiveMenu('exercises');
        } else if (path.includes('/admin/warmups')) {
            setActiveMenu('warmups');
        } else {
            setActiveMenu('dashboard');
        }
    }, [location]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const menuItems = [
        {
            id: 'dashboard',
            path: '/admin/dashboard',
            icon: '/img/home.png',
            label: 'Главная'
        },
        {
            id: 'tests',
            path: '/admin/tests',
            icon: '/img/test.png',
            label: 'Тесты'
        },
        {
            id: 'workouts',
            path: '/admin/workouts',
            icon: '/img/training.png',
            label: 'Тренировки'
        },
        {
            id: 'subscriptions',
            path: '/admin/subscriptions',
            icon: '/img/subs.png',
            label: 'Подписки'
        },
        {
            id: 'tags',
            path: '/admin/tags',
            icon: '/img/tags.png',
            label: 'Теги'
        },
        {
            id: 'exercises',
            path: '/admin/exercises',
            icon: '/img/exrs.png',
            label: 'Упражнения'
        },
        {
            id: 'warmups',
            path: '/admin/warmups',
            icon: '/img/warm-up.png',
            label: 'Разминка'
        }
    ];


    // Показываем загрузку пока проверяем авторизацию
    if (!isAuthenticated || !user) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                Загрузка...
            </div>
        );
    }

    return (
        <div className="admin_layout">
            <aside className="sidebar">
                <div className="logo_sidebar">
                    <img src="/img/Logo.png" alt="Logo" />
                </div>

                <div className="sidebar_nav">
                    <ul>
                        {menuItems.map(item => (
                            <li key={item.id} className={activeMenu === item.id ? 'active' : ''}>
                                <Link to={item.path}>
                                    <img src={item.icon} alt={item.label} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <button className="logout_from_admin" onClick={handleLogoutClick}>
                        Выход
                    </button>
                    <LogoutModal
                        isOpen={isLogoutModalOpen}
                        onClose={handleCancelLogout}
                        onConfirm={handleConfirmLogout}
                    />
                </div>
            </aside>

            <main className="main_content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;