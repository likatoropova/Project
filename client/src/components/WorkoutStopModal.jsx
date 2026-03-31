import React from "react";
import ReactDOM from "react-dom";
import "../styles/logout_modal.scss";

const WorkoutStopModal = ({
  isOpen,
  onConfirm,
  onCancel,
  loading = false,
  error = "",
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={!loading ? onCancel : undefined}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Завершить тренировку</h3>
        <p>
          Вы действительно хотите завершить тренировку? Если Вы захотите ее
          продолжить, придется начать сначала
        </p>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-buttons">
          <button
            className="btn-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Загрузка..." : "Завершить"}
          </button>
          <button className="btn-cancel" onClick={onCancel} disabled={loading}>
            Отменить
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default WorkoutStopModal;
