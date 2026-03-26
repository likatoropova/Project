import React, { useState, useEffect } from 'react';

const TagModal = ({ isOpen, onClose, onSubmit, tag = null, loading = false }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (tag) {
            setName(tag.name);
        } else {
            setName('');
        }
        setError('');
    }, [tag, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Название тега обязательно');
            return;
        }

        if (name.trim().length < 2) {
            setError('Название должно содержать минимум 2 символа');
            return;
        }

        onSubmit({ name: name.trim() });
    };

    if (!isOpen) return null;

    return (
        <div className="modal_overlay" onClick={onClose}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                <h2>{tag ? 'Редактировать тег' : 'Создать тег'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form_group">
                        <input
                            id="tag_name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Введите название тега"
                            disabled={loading}
                            autoFocus
                        />
                        {error && <div className="error-message" style={{ marginTop: '8px' }}>{error}</div>}
                    </div>

                    <div className="modal_actions">
                        <button type="submit" className="submit_btn" disabled={loading}>
                            {loading ? 'Сохранение...' : (tag ? 'Сохранить' : 'Создать')}
                        </button>
                        <button type="button" className="cancel_btn" onClick={onClose} disabled={loading}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TagModal;