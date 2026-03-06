import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/logout_modal.css';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Вы уверены, что хотите выйти?</h3>
        <div className="modal-buttons">
          <button className="btn-confirm" onClick={onConfirm}>
            Выйти
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Отменить
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoutModal;