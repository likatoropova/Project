// src/pages/admin/AdminWarmups.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useWarmups } from '../../hooks/admin/useWarmups';
import '../../styles/admin/admin_warmups.scss';

const AdminWarmups = () => {
    const navigate = useNavigate();
    const {
        warmups,
        loading,
        error,
        meta,
        searchQuery,
        currentPage,
        removeWarmup,
        handleSearch,
        goToPage,
        formatDate
    } = useWarmups();

    const handleCreateWarmup = () => {
        navigate('/admin/warmups/create');
    };

    const handleEditWarmup = (id) => {
        navigate(`/admin/warmups/edit/${id}`);
    };

    const handleDeleteWarmup = async (id, name) => {
        if (window.confirm(`Вы уверены, что хотите удалить разминку "${name}"?`)) {
            const result = await removeWarmup(id);
            if (!result.success) {
                alert(result.error || 'Ошибка при удалении разминки');
            }
        }
    };

    const renderWarmupItem = (warmup) => (
        <div key={warmup.id} className="warm_up_cont">
            <div className="warm_up_card">
                <img
                    src={warmup.image_url || warmup.image || '/img/IMG.png'}
                    alt={warmup.name}
                    onError={(e) => { e.target.src = '/img/IMG.png'; }}
                />
                <div className="warm_up_info">
                    <p className="warm_up_title">{warmup.name}</p>
                    <p className="warm_up_description">{warmup.description}</p>
                    <p className="warm_up_created_at">{formatDate(warmup.created_at)}</p>
                </div>
            </div>
            <div className="but_cont">
                <button className="edit" onClick={() => handleEditWarmup(warmup.id)}>
                    Редактировать
                </button>
                <button className="delete" onClick={() => handleDeleteWarmup(warmup.id, warmup.name)}>
                    Удалить
                </button>
            </div>
        </div>
    );

    const renderPagination = () => {
        if (meta.last_page <= 1) return null;

        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(meta.last_page, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="pagination">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                    ←
                </button>

                {startPage > 1 && (
                    <>
                        <button onClick={() => goToPage(1)}>1</button>
                        {startPage > 2 && <span className="page-dots">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={currentPage === page ? 'active' : ''}
                    >
                        {page}
                    </button>
                ))}

                {endPage < meta.last_page && (
                    <>
                        {endPage < meta.last_page - 1 && <span className="page-dots">...</span>}
                        <button onClick={() => goToPage(meta.last_page)}>
                            {meta.last_page}
                        </button>
                    </>
                )}

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === meta.last_page}
                >
                    →
                </button>

                <span className="page-info">
          Всего: {meta.total} разминок
        </span>
            </div>
        );
    };

    return (
        <>
            <AdminPageHeader
                title="Управление разминками"
                buttonText="Создать разминку"
                onButtonClick={handleCreateWarmup}
            />

            <div className="warm_up_container">
                <div className="search_group_admin">
                    <img src="/img/search.png" alt="search" />
                    <input
                        type="text"
                        placeholder="Поиск по названию..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="error-message" style={{ marginLeft: '32px', marginBottom: '16px' }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="empty-state" style={{ marginLeft: '32px' }}>
                        <p>Загрузка разминок...</p>
                    </div>
                ) : warmups.length === 0 ? (
                    <div className="empty-state" style={{ marginLeft: '32px' }}>
                        <p>Разминки не найдены</p>
                        {searchQuery && <p>Попробуйте изменить поисковый запрос</p>}
                    </div>
                ) : (
                    <>
                        {warmups.map(renderWarmupItem)}
                        {renderPagination()}
                    </>
                )}
            </div>
        </>
    );
};

export default AdminWarmups;