// src/pages/admin/TestExercises.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { getTestById } from '../../api/admin/testsAPI';
import { getTestingExercises, attachExercisesToTest, getTestExercises, removeExerciseFromTest } from '../../api/admin/testingExercisesAPI';
import '../../styles/admin/test_exercises.scss';

const TestExercises = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [test, setTest] = useState(null);
    const [allExercises, setAllExercises] = useState([]);
    const [testExercises, setTestExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exercisesLoading, setExercisesLoading] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');

    const { execute: executeGetTest } = useApi(getTestById);
    const { execute: executeGetTestingExercises } = useApi(getTestingExercises);
    const { execute: executeGetTestExercises } = useApi(getTestExercises);
    const { execute: executeAttachExercises } = useApi(attachExercisesToTest);
    const { execute: executeRemoveExercise } = useApi(removeExerciseFromTest);

    // Загрузка данных теста
    useEffect(() => {
        const fetchTest = async () => {
            const response = await executeGetTest(id);
            if (response.success && response.data) {
                setTest(response.data.data);
            } else {
                setError('Не удалось загрузить данные теста');
            }
        };
        fetchTest();
    }, [id, executeGetTest]);

    // Загрузка упражнений теста
    const fetchTestExercises = async () => {
        const response = await executeGetTestExercises(id);
        if (response.success && response.data) {
            setTestExercises(response.data.data || []);
        }
    };

    // Загрузка всех доступных упражнений
    const fetchAllExercises = async () => {
        const response = await executeGetTestingExercises({ per_page: 100 });
        if (response.success && response.data) {
            const exercises = response.data.data || [];
            setAllExercises(exercises);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchTestExercises(), fetchAllExercises()]);
            setLoading(false);
        };
        loadData();
    }, [id]);

    const handleAddExercises = async () => {
        if (selectedExercises.length === 0) {
            setError('Выберите хотя бы одно упражнение');
            return;
        }

        setExercisesLoading(true);
        const response = await executeAttachExercises(id, selectedExercises);
        setExercisesLoading(false);

        if (response.success) {
            await fetchTestExercises();
            setShowAddModal(false);
            setSelectedExercises([]);
            setError('');
        } else {
            setError(response.error || 'Ошибка добавления упражнений');
        }
    };

    const handleRemoveExercise = async (exerciseId, exerciseName) => {
        if (window.confirm(`Вы уверены, что хотите удалить упражнение "${exerciseName}" из теста?`)) {
            const response = await executeRemoveExercise(id, exerciseId);
            if (response.success) {
                await fetchTestExercises();
            } else {
                setError(response.error || 'Ошибка удаления упражнения');
            }
        }
    };

    const handleEditExercise = (exerciseId) => {
        navigate(`/admin/testing-exercises/edit/${exerciseId}?testId=${id}`);
    };

    const handleCreateExercise = () => {
        navigate(`/admin/testing-exercises/create?testId=${id}`);
    };

    const handleBack = () => {
        navigate('/admin/tests');
    };

    const filteredExercises = allExercises.filter(exercise => {
        const isAlreadyAdded = testExercises.some(te => te.id === exercise.id);
        const matchesSearch = exercise.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return !isAlreadyAdded && matchesSearch;
    });

    if (loading) {
        return (
            <div className="test-exercises-container">
                <div className="loading">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="test-exercises-container">
            <div className="form-header">
                <button className="back-btn" onClick={handleBack}>←</button>
                <h1>{test?.title} - Управление упражнениями</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="exercises-header">
                <button className="btn-add" onClick={() => setShowAddModal(true)}>
                    + Добавить упражнения
                </button>
                <button className="btn-create" onClick={handleCreateExercise}>
                    Создать новое упражнение
                </button>
            </div>

            <div className="exercises-list">
                <h3>Упражнения теста ({testExercises.length})</h3>
                {testExercises.length === 0 ? (
                    <div className="empty-state">
                        <p>Упражнения не добавлены</p>
                        <p>Нажмите "Добавить упражнения", чтобы выбрать упражнения для этого теста</p>
                    </div>
                ) : (
                    <div className="exercises-grid">
                        {testExercises.map((exercise, index) => (
                            <div key={exercise.id} className="exercise-card">
                                <div className="exercise-number">{index + 1}</div>
                                <div className="exercise-content">
                                    <p className="exercise-description">{exercise.description}</p>
                                    {exercise.image && (
                                        <img
                                            src={`http://localhost:8000/storage/${exercise.image}`}
                                            alt="Exercise"
                                            className="exercise-thumb"
                                        />
                                    )}
                                </div>
                                <div className="exercise-actions">
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEditExercise(exercise.id)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn-remove"
                                        onClick={() => handleRemoveExercise(exercise.id, exercise.description)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Модальное окно добавления упражнений */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Добавить упражнения</h2>

                        <div className="search-group">
                            <input
                                type="text"
                                placeholder="Поиск упражнений..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="exercises-select-list">
                            {filteredExercises.length === 0 ? (
                                <div className="empty-state-small">
                                    {searchQuery ? 'Упражнения не найдены' : 'Нет доступных упражнений'}
                                </div>
                            ) : (
                                filteredExercises.map(exercise => (
                                    <label key={exercise.id} className="exercise-checkbox">
                                        <input
                                            type="checkbox"
                                            value={exercise.id}
                                            checked={selectedExercises.includes(exercise.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedExercises([...selectedExercises, exercise.id]);
                                                } else {
                                                    setSelectedExercises(selectedExercises.filter(id => id !== exercise.id));
                                                }
                                            }}
                                        />
                                        <span>{exercise.description}</span>
                                        {exercise.testings_count > 0 && (
                                            <span className="usage-count">(используется в {exercise.testings_count} тестах)</span>
                                        )}
                                    </label>
                                ))
                            )}
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                                Отмена
                            </button>
                            <button
                                className="btn-submit"
                                onClick={handleAddExercises}
                                disabled={exercisesLoading || selectedExercises.length === 0}
                            >
                                {exercisesLoading ? 'Добавление...' : `Добавить (${selectedExercises.length})`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestExercises;