// src/components/profile/DeleteAccountModal.jsx

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { deleteAccount } from '../../api/profileAPI';
import '../../styles/delete_account_modal.scss';

const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirmText, setConfirmText] = useState('');

    if (!isOpen) return null;

    const handleDelete = async () => {
        if (confirmText !== 'УДАЛИТЬ') {
            setError('Введите "УДАЛИТЬ" для подтверждения');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await deleteAccount();

            if (result.success) {
                await onConfirm();
            } else {
                setError(result.message || 'Ошибка удаления аккаунта');
            }
        } catch (err) {
            setError('Произошла ошибка при удалении аккаунта');
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
            <div className="modal_content_delet" onClick={(e) => e.stopPropagation()}>
                <h3>Вы уверены, что хотите удалить профиль?</h3>
                    <div className="modal_actions">
                        <button
                            className="submit_btn"
                            onClick={handleDelete}
                        >
                            {loading ? 'Удаление...' : 'Удалить'}
                        </button>
                        <button
                            className="cancel_btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Отменить
                        </button>
                    </div>
            </div>
        </div>,
        document.body
    );
};

export default DeleteAccountModal;