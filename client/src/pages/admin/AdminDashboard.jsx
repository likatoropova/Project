import React, { useEffect } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
    const { user } = useAuth();

    useEffect(() => {
        console.log('AdminDashboard mounted, user:', user);

        // Проверяем каждые 2 секунды, не изменился ли user
        const interval = setInterval(() => {
            console.log('AdminDashboard - current user:', user);
        }, 2000);

        return () => clearInterval(interval);
    }, [user]);

    return (
        <>
            <AdminPageHeader title="Панель управления" />
            <div className="content_area">
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '40px',
                    textAlign: 'center',
                    color: '#999'
                }}>
                    <p>Статистика и последние добавленные элементы появятся здесь позже</p>
                    <p style={{ marginTop: '20px', fontSize: '12px' }}>
                        User ID: {user?.id}, Role ID: {user?.role_id}
                    </p>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;