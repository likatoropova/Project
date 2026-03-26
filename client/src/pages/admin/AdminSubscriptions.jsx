// src/pages/admin/AdminSubscriptions.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useSubscriptions } from '../../hooks/admin/useSubscriptions';
import '../../styles/admin/admin_subscriptions.scss';

const AdminSubscriptions = () => {
    const navigate = useNavigate();
    const {
        subscriptions,
        loading,
        error,
        meta,
        searchQuery,
        currentPage,
        removeSubscription,
        handleSearch,
        goToPage,
        formatDate,
        formatPrice
    } = useSubscriptions();

    const handleCreateSubscription = () => {
        navigate('/admin/subscriptions/create');
    };

    const handleEditSubscription = (id) => {
        navigate(`/admin/subscriptions/edit/${id}`);
    };

    const handleDeleteSubscription = async (id, name) => {
        if (window.confirm(`Вы уверены, что хотите удалить подписку "${name}"?`)) {
            const result = await removeSubscription(id);
            if (!result.success) {
                alert(result.error || 'Ошибка при удалении подписки');
            }
        }
    };

    const renderSubscriptionItem = (subscription) => (
        <div key={subscription.id} className="subs_cont">
            <div className="subs_card">
                <img
                    src={subscription.image || '/img/sub.png'}
                    alt={subscription.name}
                    onError={(e) => { e.target.src = '/img/sub.png'; }}
                />
                <div className="subs_info">
                    <p className="subs_title">{subscription.name}</p>
                    <p className="subs_description">{subscription.description}</p>
                    <p className="subs_created_at">{formatDate(subscription.created_at)}</p>
                </div>
            </div>
            <div className="but_cont">
                <button className="edit" onClick={() => handleEditSubscription(subscription.id)}>
                    Редактировать
                </button>
                <button className="delete" onClick={() => handleDeleteSubscription(subscription.id, subscription.name)}>
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
          Всего: {meta.total} подписок
        </span>
            </div>
        );
    };

    return (
        <>
            <AdminPageHeader
                title="Управление подписками"
                buttonText="Создать подписку"
                onButtonClick={handleCreateSubscription}
            />

            <div className="subs_container">
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
                        <p>Загрузка подписок...</p>
                    </div>
                ) : subscriptions.length === 0 ? (
                    <div className="empty-state" style={{ marginLeft: '32px' }}>
                        <p>Подписки не найдены</p>
                        {searchQuery && <p>Попробуйте изменить поисковый запрос</p>}
                    </div>
                ) : (
                    <>
                        {subscriptions.map(renderSubscriptionItem)}
                        {renderPagination()}
                    </>
                )}
            </div>
        </>
    );
};

export default AdminSubscriptions;