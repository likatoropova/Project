// src/components/profile/SubscriptionCancelModal.jsx

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { cancelSubscription } from '../../api/profileAPI';
import '../../styles/subscription_cancel_modal.scss';

const SubscriptionCancelModal = ({ isOpen, onClose, subscription }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isOpen || !subscription) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleCancel = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await cancelSubscription(subscription.id);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                }, 2000);
            } else {
                setError(result.message || 'Ошибка отмены подписки');
            }
        } catch (err) {
            setError('Произошла ошибка при отмене подписки');
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
            <div className="modal_content_sub" onClick={(e) => e.stopPropagation()}>
                    <h2>Отменить подписку</h2>
                    {success ? (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h4>Подписка отменена</h4>
                            <p>Вы больше не будете получать списания</p>
                        </div>
                    ) : (
                        <>
                            <h4>Вы действительно хотите отменить подписку? </h4>

                            <div className="modal_actions">
                                <button
                                    className="submit_btn"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    {loading ? 'Отмена...' : 'Подтвердить'}
                                </button>
                                <button
                                    className="cancel_btn"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Отменить
                                </button>
                            </div>
                        </>
                    )}
                </div>
        </div>,
        document.body
    );
};

export default SubscriptionCancelModal;