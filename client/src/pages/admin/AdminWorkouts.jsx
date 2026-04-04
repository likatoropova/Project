import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useWorkoutsAdmin } from '../../hooks/admin/useWorkoutsAdmin';
import '../../styles/admin/admin_workouts.scss';
import '../../styles/admin/admin_buttons.scss';

const AdminWorkouts = () => {
    const navigate = useNavigate();
    const {
        workouts,
        loading,
        error,
        meta,
        searchQuery,
        currentPage,
        removeWorkout,
        handleSearch,
        goToPage,
        formatDate,
        formatDuration
    } = useWorkoutsAdmin();

    const handleCreateWorkout = () => {
        navigate('/admin/workouts/create');
    };

    const handleEditWorkout = (id) => {
        navigate(`/admin/workouts/edit/${id}`);
    };

    const handleDeleteWorkout = async (id, title) => {
        if (window.confirm(`Вы уверены, что хотите удалить тренировку "${title}"?`)) {
            const result = await removeWorkout(id);
            if (!result.success) {
                alert(result.error || 'Ошибка при удалении тренировки');
            }
        }
    };

    const renderWorkoutItem = (workout) => (
        <div key={workout.id} className="training_cont">
            <div className="training_card_admin">
                <img
                    src={workout.image_url || workout.image || '/img/training_frame2_card2.png'}
                    alt={workout.title}
                    onError={(e) => { e.target.src = '/img/training_frame2_card2.png'; }}
                />
                <div className="info_workout">
                    <p className="training_title">{workout.title}</p>
                    <p className="training_description">{workout.description}</p>
                    <p className="training_created_at">{formatDate(workout.created_at)}</p>
                </div>
            </div>
            <div className="but_cont">
                <button className="edit" onClick={() => handleEditWorkout(workout.id)}>
                    Редактировать
                </button>
                <button className="delete" onClick={() => handleDeleteWorkout(workout.id, workout.title)}>
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
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="arrows">
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
                title="Управление тренировками"
                buttonText="Создать тренировку"
                onButtonClick={handleCreateWorkout}
            />

            <div className="trainings_container_admin">
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
                        <p>Загрузка тренировок...</p>
                    </div>
                ) : workouts.length === 0 ? (
                    <div className="empty-state" style={{ marginLeft: '32px' }}>
                        <p>Тренировки не найдены</p>
                        {searchQuery && <p>Попробуйте изменить поисковый запрос</p>}
                    </div>
                ) : (
                    <>
                        {workouts.map(renderWorkoutItem)}
                        {renderPagination()}
                    </>
                )}
            </div>
        </>
    );
};

export default AdminWorkouts;