import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useTests } from '../../hooks/admin/useTests';
import '../../styles/admin/admin_tests.scss';
import '../../styles/admin/admin_buttons.scss';

const AdminTests = () => {
    const navigate = useNavigate();
    const {
        tests,
        loading,
        error,
        meta,
        searchQuery,
        currentPage,
        selectedCategory,
        categories,
        removeTest,
        handleSearch,
        handleCategoryFilter,
        goToPage,
        formatDate
    } = useTests();

    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const handleCreateTest = () => {
        navigate('/admin/tests/create');
    };

    const handleEditTest = (id) => {
        navigate(`/admin/tests/edit/${id}`);
    };

    const handleDeleteTest = async (id, title) => {
        if (window.confirm(`Вы уверены, что хотите удалить тест "${title}"?`)) {
            const result = await removeTest(id);
            if (!result.success) {
                alert(result.error || 'Ошибка при удалении теста');
            }
        }
    };

    const renderTestItem = (test) => (
        <div key={test.id} className="admin_test_cont">
            <div className="admin_test_card">
                <img
                    src={test.image ? `http://localhost:8000/storage/${test.image}` : '/img/IMG.png'}
                    alt={test.title}
                    onError={(e) => {
                        e.target.src = '/img/IMG.png';
                    }}
                />
                <div className="info_test">
                    <p className="test_title">{test.title}</p>
                    <p className="test_description">{test.description || 'Описание отсутствует'}</p>
                    <p className="test_created_at">{formatDate(test.created_at)}</p>
                </div>
            </div>
            <div className="but_cont">
                <button className="edit" onClick={() => handleEditTest(test.id)}>
                    Редактировать
                </button>
                <button className="delete" onClick={() => handleDeleteTest(test.id, test.title)}>
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
                <button className="arrows" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
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
                title="Управление тестами"
                buttonText="Создать тест"
                onButtonClick={handleCreateTest}
            />

            <div className="admin_test_container">
                <div className="search_filtration_admin">
                    <div className="search_group_admin">
                        <img src="/img/search.png" alt="search" />
                        <input
                            type="text"
                            placeholder="Поиск"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>

                    {categories.length > 0 && (
                        <div className="search_group_admin">
                            <div className="dropdown_admin">
                                <button className="dropdown_btn" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
                                    Фильтрация
                                </button>
                                <img src="/img/filtr.png" alt="filtration" />
                                {showCategoryDropdown && (
                                    <div className="dropdown_content">
                                        <div
                                            className={`dropdown_item ${!selectedCategory ? 'active' : ''}`}
                                            onClick={() => {
                                                handleCategoryFilter(null);
                                                setShowCategoryDropdown(false);
                                            }}
                                        >
                                            Все категории
                                        </div>
                                        {categories.map(cat => (
                                            <div
                                                key={cat.id}
                                                className={`dropdown_item ${selectedCategory === cat.id ? 'active' : ''}`}
                                                onClick={() => {
                                                    handleCategoryFilter(cat.id);
                                                    setShowCategoryDropdown(false);
                                                }}
                                            >
                                                {cat.name}
                                            </div>
                                        ))}
                                        <div className="dropdown_actions">
                                            <button
                                                className="apply_btn"
                                                onClick={() => setShowCategoryDropdown(false)}
                                            >
                                                Применить
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    )}
                </div>
                {error && (
                    <div className="error-message" style={{ marginLeft: '32px', marginBottom: '16px' }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="empty-state" style={{ marginLeft: '32px' }}>
                        <p>Загрузка тестов...</p>
                    </div>
                ) : tests.length === 0 ? (
                    <div className="empty-state" style={{ marginLeft: '32px' }}>
                        <p>Тесты не найдены</p>
                        {searchQuery && <p>Попробуйте изменить поисковый запрос</p>}
                    </div>
                ) : (
                    <>
                        {tests.map(renderTestItem)}
                        {renderPagination()}
                    </>
                )}
            </div>
        </>
    );
};

export default AdminTests;