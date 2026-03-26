// src/components/ProtectedAdminRoute.jsx

import React, { useRef, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedAdminRoute = () => {
    const { isAuthenticated, loading, user } = useAuth();
    const hasRedirected = useRef(false);

    // Используем прямую проверку user.role_id
    const isUserAdmin = user?.role_id === 1;

    console.log('ProtectedAdminRoute - State:', {
        isAuthenticated,
        loading,
        userRoleId: user?.role_id,
        isUserAdmin,
        hasRedirected: hasRedirected.current
    });

    // Если загрузка или нет пользователя, показываем загрузку
    if (loading || !user) {
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

    // Если не авторизован
    if (!isAuthenticated) {
        if (!hasRedirected.current) {
            hasRedirected.current = true;
            console.log('User not authenticated, redirecting to login');
            return <Navigate to="/login" replace />;
        }
        return null;
    }

    // Проверяем админа
    if (!isUserAdmin) {
        if (!hasRedirected.current) {
            hasRedirected.current = true;
            console.log('User is not admin, redirecting to home');
            return <Navigate to="/" replace />;
        }
        return null;
    }

    // Сброс флага при успешном доступе
    hasRedirected.current = false;
    console.log('Admin access granted');
    return <Outlet />;
};

export default ProtectedAdminRoute;