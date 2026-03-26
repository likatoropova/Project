import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const useAdminRedirect = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            const isAdmin = user?.role === 'admin' || user?.role === 'administrator' || user?.is_admin === true;
            if (isAdmin) {
                navigate('/admin/dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);
};