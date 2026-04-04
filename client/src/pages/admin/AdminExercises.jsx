import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useExercises } from '../../hooks/admin/useExercises';
import '../../styles/admin/admin_exercises.scss';
import '../../styles/admin/admin_buttons.scss';

const AdminExercises = () => {
    const navigate = useNavigate();
    const {
        exercises,
        loading,
        error,
        meta,
        searchQuery,
        currentPage,
        removeExercise,
        handleSearch,
        goToPage,
        formatDate
    } = useExercises();

    const handleCreateExercise = () => {
        navigate('/admin/exercises/create');
    };

    const handleEditExercise = (id) => {
        navigate(`/admin/exercises/edit/${id}`);
    };

    const handleDeleteExercise = async (id, title) => {
        if (window.confirm(`Вы уверены, что хотите удалить упражнение "${title}"?`)) {
            const result = await removeExercise(id);
            if (!result.success) {
                alert(result.error || 'Ошибка при удалении упражнения');
            }
        }
    };

    const renderExerciseItem = (exercise) => (
        <div key={exercise.id} className="exrs_cont">
            <div className="exrs_card">
                <img
                    src={exercise.image_url || exercise.image || '/img/training_frame4_card2.png'}
                    alt={exercise.title}
                    onError={(e) => { e.target.src = '/img/training_frame4_card2.png'; }}
                />
                <div className="exrs_info">
                    <p className="exrs_title">{exercise.title}</p>
                    <p className="exrs_description">{exercise.description}</p>
                    <p className="exrs_created_at">{formatDate(exercise.created_at)}</p>
                </div>
            </div>
            <div className="but_cont">
                <button className="edit" onClick={() => handleEditExercise(exercise.id)}>
                    Редактировать
                </button>
                <button className="delete" onClick={() => handleDeleteExercise(exercise.id, exercise.title)}>
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
                title="Управление упражнениями"
                buttonText="Создать упражнение"
                onButtonClick={handleCreateExercise}
            />

            <div className="exrs_container">
                <div className="search_group_admin">
                    <img src="/img/search.png" alt="search" />
                    <input
                        type="text"
                        placeholder="Поиск"
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
                        <p>Загрузка упражнений...</p>
                    </div>
                ) : exercises.length === 0 ? (
                    <div className="empty-state" style={{ marginLeft: '32px' }}>
                        <p>Упражнения не найдены</p>
                        {searchQuery && <p>Попробуйте изменить поисковый запрос</p>}
                    </div>
                ) : (
                    <>
                        {exercises.map(renderExerciseItem)}
                        {renderPagination()}
                    </>
                )}
            </div>
        </>
    );
};

export default AdminExercises;