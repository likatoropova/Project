// src/components/profile/HistoryModal.jsx

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/history_modal.scss';

const HistoryModal = ({ isOpen, onClose, history }) => {
    const [activeTab, setActiveTab] = useState('subscriptions');

    if (!isOpen) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const renderSubscriptionsHistory = () => {
        const subscriptions = history?.subscriptions?.history || [];

        if (subscriptions.length === 0) {
            return <div className="empty-state">История подписок пуста</div>;
        }

        return (
            <div className="history-list">
                {subscriptions.map((sub) => (
                    <div key={sub.id} className="history-item">
                        <div className="item-header">
                            <p className="workout_name">Название: {sub.subscription?.name || 'Подписка'}</p>
                        </div>
                        <div className="item-details">
                            <p>Стоимость: {parseFloat(sub.subscription?.price).toLocaleString('ru-RU')} ₽</p>
                            <p>Период: {formatDate(sub.start_date)} - {formatDate(sub.end_date)}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderWorkoutsHistory = () => {
        const workouts = history?.workouts?.history || [];

        if (workouts.length === 0) {
            return <div className="empty-state">История тренировок пуста</div>;
        }

        return (
            <div className="history-list">
                {workouts.map((workout) => (
                    <div key={workout.id} className="history-item">
                        <div className="item-header">
                            <p className="workout_name">Название: {workout.workout?.title || 'Тренировка'}</p>
                        </div>
                        <div className="item-details">
                            <p>Завершено: {formatDate(workout.completed_at)}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderTestsHistory = () => {
        const tests = history?.tests?.history || [];

        if (tests.length === 0) {
            return <div className="empty-state">История тестов пуста</div>;
        }

        return (
            <div className="history-list">
                {tests.map((test, index) => (
                    <div key={index} className="history-item">
                        <div className="item-header">
                            <p className="workout_name">{test.testing?.title || 'Тест'}</p>
                        </div>
                        <div className="item-details">
                            <p>Дата: {formatDate(test.completed_at)}</p>
                            {test.exercises_count && <p>Упражнений: {test.exercises_count}</p>}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <div className="modal_overlay" onClick={handleOverlayClick}>
            <div className="history_modal" onClick={(e) => e.stopPropagation()}>
                <div className="history_tabs">
                    <button
                        className={activeTab === 'subscriptions' ? 'active' : ''}
                        onClick={() => setActiveTab('subscriptions')}
                    >
                        Подписки
                    </button>
                    <button
                        className={activeTab === 'workouts' ? 'active' : ''}
                        onClick={() => setActiveTab('workouts')}
                    >
                        Тренировки
                    </button>
                    <button
                        className={activeTab === 'tests' ? 'active' : ''}
                        onClick={() => setActiveTab('tests')}
                    >
                        Тесты
                    </button>
                </div>

                <div className="history-content">
                    {activeTab === 'subscriptions' && renderSubscriptionsHistory()}
                    {activeTab === 'workouts' && renderWorkoutsHistory()}
                    {activeTab === 'tests' && renderTestsHistory()}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default HistoryModal;