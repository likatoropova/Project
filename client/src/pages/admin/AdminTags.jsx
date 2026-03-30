import React, { useState } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import TagModal from '../../components/admin/TagModal';
import { useTags } from '../../hooks/admin/useTags';
import '../../styles/admin/admin_tags.scss';
import '../../styles/admin/admin_buttons.scss';

const AdminTags = () => {
    const {
        tags,
        loading,
        error,
        meta,
        searchQuery,
        currentPage,
        addTag,
        editTag,
        removeTag,
        handleSearch,
        goToPage
    } = useTags();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const handleCreateClick = () => {
        setEditingTag(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (tag) => {
        setEditingTag(tag);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data) => {
        setModalLoading(true);
        let result;

        if (editingTag) {
            result = await editTag(editingTag.id, data);
        } else {
            result = await addTag(data);
        }

        setModalLoading(false);

        if (result.success) {
            setIsModalOpen(false);
            setEditingTag(null);
        } else {
            alert(result.error || 'Произошла ошибка');
        }
    };

    const handleDeleteClick = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот тег?')) {
            removeTag(id);
        }
    };

    const renderTags = () => {
        if (!Array.isArray(tags) || tags.length === 0) {
            return null;
        }

        // Разделяем теги на две колонки для лучшего отображения
        const midIndex = Math.ceil(tags.length / 2);
        const leftColumnTags = tags.slice(0, midIndex);
        const rightColumnTags = tags.slice(midIndex);

        return (
            <div className="tags_grid">
                <div className="tags_row">
                    <div className="first_clmn">
                        {leftColumnTags.map(tag => renderTagItem(tag))}
                    </div>
                    <div className="second_clmn">
                        {rightColumnTags.map(tag => renderTagItem(tag))}
                    </div>
                </div>
            </div>
        );
    };

    const renderTagItem = (tag) => (
        <div key={tag.id} className="tag_item">
            <div className="tag_info">
                <div className="tag_badge">
                    {tag.name}
                </div>
            </div>
            <div className="tag_actions">
                <button className="edit_btn" onClick={() => handleEditClick(tag)}>
                    Редактировать
                </button>
                <button className="delete_btn" onClick={() => handleDeleteClick(tag.id)}>
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
            <div className="pagination_admin">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="arrows"
                >
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
                    className="arrows"
                >
                    →
                </button>
            </div>
        );
    };

    return (
        <>
            <AdminPageHeader
                title="Управление тегами"
                buttonText="Создать тег"
                onButtonClick={handleCreateClick}
            />

            <div className="tags_container">
                <div className="search_group_admin">
                    <img src="/img/search.png" alt="search" className="search_icon" />
                    <input
                        type="text"
                        placeholder="Поиск"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="empty-state">
                        <p>Загрузка тегов...</p>
                    </div>
                ) : !Array.isArray(tags) || tags.length === 0 ? (
                    <div className="empty-state">
                        <p>Теги не найдены</p>
                        {searchQuery && <p>Попробуйте изменить поисковый запрос</p>}
                    </div>
                ) : (
                    <>
                        {renderTags()}
                        {renderPagination()}
                    </>
                )}
            </div>

            <TagModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTag(null);
                }}
                onSubmit={handleModalSubmit}
                tag={editingTag}
                loading={modalLoading}
            />
        </>
    );
};

export default AdminTags;