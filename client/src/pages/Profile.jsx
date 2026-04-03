// src/pages/Profile.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import Header from '../components/Header';
import StatisticsChart from '../components/profile/StatisticsChart';
import UserInfoCard from '../components/profile/UserInfoCard';
import SubscriptionCard from '../components/profile/SubscriptionCard';
import PaymentCards from '../components/profile/PaymentCards';
import UserParameters from '../components/profile/UserParameters';
import LogoutModal from '../components/LogoutModal';
import ProfileEditModal from '../components/profile/ProfileEditModal';
import PasswordChangeModal from '../components/profile/PasswordChangeModal';
import SubscriptionCancelModal from '../components/profile/SubscriptionCancelModal';
import HistoryModal from '../components/profile/HistoryModal';

import '../styles/profile.scss';

const Profile = () => {

    const {
        profile,
        loading,
        error,
        statistics,
        fetchStatistics,
        updateParameters
    } = useProfile();

    const [localStatistics, setLocalStatistics] = useState({
        volume: null,
        trend: null,
        frequency: null
    });

    const [activeStatTab, setActiveStatTab] = useState('volume');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showProfileEditModal, setShowProfileEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleStatTabChange = (tab) => {
        setActiveStatTab(tab);
        fetchStatistics(tab);
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="spinner"></div>
                <p>Загрузка профиля...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Попробовать снова</button>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Header />

            <div className="profile-container">
                <div className="profile_hello">
                    <h1 className="hello">Здравствуйте, {profile?.user?.name?.split(' ')[0] || 'Пользователь'}</h1>
                </div>

                <div className="stats_user_info">
                <div className="profile_main">
                    <div className="stat-tabs">
                        <button
                            className={activeStatTab === 'volume' ? 'active' : ''}
                            onClick={() => handleStatTabChange('volume')}
                        >
                            Объем
                        </button>
                        <button
                            className={activeStatTab === 'frequency' ? 'active' : ''}
                            onClick={() => handleStatTabChange('frequency')}
                        >
                            Частота
                        </button>
                        <button
                            className={activeStatTab === 'trend' ? 'active' : ''}
                            onClick={() => handleStatTabChange('trend')}
                        >
                            Тренд
                        </button>
                        <button className="history_btn" onClick={() => setShowHistoryModal(true)}>
                            История
                        </button>
                    </div>
                    <div className="statistics_section">
                        <StatisticsChart
                            type={activeStatTab}
                            data={statistics?.[activeStatTab] || localStatistics[activeStatTab]}
                        />
                    </div>
                </div>
                    <UserInfoCard
                        user={profile?.user}
                        onEditProfile={() => setShowProfileEditModal(true)}
                        onChangePassword={() => setShowPasswordModal(true)}
                    />
                </div>

                {profile?.subscriptions?.active && (
                    <SubscriptionCard
                        subscription={profile.subscriptions.active}
                        onCancel={() => setShowCancelSubscriptionModal(true)}
                        onRenew={() => navigate(`/subscriptions/${profile.subscriptions.active.id}`)}
                    />
                )}

                <PaymentCards
                    cards={profile?.cards || []}
                    onAddCard={() => navigate('/payment-methods')}
                />

                {/* Параметры пользователя */}
                <UserParameters
                    parameters={profile?.parameters}
                    phase={profile?.phase}
                    onUpdate={updateParameters}
                />
            </div>

            {/* Модальные окна */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />

            <ProfileEditModal
                isOpen={showProfileEditModal}
                onClose={() => setShowProfileEditModal(false)}
                user={profile?.user}
            />

            <PasswordChangeModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />

            <SubscriptionCancelModal
                isOpen={showCancelSubscriptionModal}
                onClose={() => setShowCancelSubscriptionModal(false)}
                subscription={profile?.subscriptions?.active}
            />

            <HistoryModal
                isOpen={showHistoryModal}
                onClose={() => setShowHistoryModal(false)}
                history={profile}
            />


        </div>
    );
};

export default Profile;