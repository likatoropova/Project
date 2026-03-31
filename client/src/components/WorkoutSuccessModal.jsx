import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/logout_modal.scss';

const WorkoutSuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Тренировка завершена</h3>
                <p>
                    Поздравляем!<br />
                    Вы завершили тренировку!
                </p>
                <p className="modal-subtitle">
                    Ваша статистика тренировок обновлена
                </p>
                <div className="modal-buttons">
                    <button
                        className="btn-confirm btn-confirm--full"
                        onClick={onClose}
                    >
                        Завершить
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default WorkoutSuccessModal;
