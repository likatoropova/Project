import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTestChoice } from '../hooks/useTestChoice';
import '../styles/test_choice_style.css';

const TestChoicePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formError, setFormError] = useState('');

    const {
        testData,
        loading,
        error,
        loadTest,
        selectedExercise,
        selectExercise,
        getExerciseOptions
    } = useTestChoice(id);

    // Мемоизируем опции упражнений
    const exerciseOptions = useMemo(() =>
            getExerciseOptions(),
        [getExerciseOptions]);

    // Логирование для отладки (только при изменении данных)
    useEffect(() => {
        if (testData) {
            console.log('Test data loaded:', {
                id,
                title: testData.title,
                exercisesCount: exerciseOptions.length
            });
        }
    }, [testData, id, exerciseOptions.length]);

    // В TestChoicePage.jsx, измените handleSubmit:
    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        if (!selectedExercise) {
            setFormError('Пожалуйста, выберите упражнение');
            return;
        }

        console.log('Переход к старту теста:', { testId: id });
        navigate(`/test-start/${id}`);
    }, [selectedExercise, id, navigate]);

    // Обработчик выбора радио кнопки
    const handleRadioChange = useCallback((exerciseId) => {
        selectExercise(exerciseId);
        setFormError('');
    }, [selectExercise]);

    // Обработчик возврата на предыдущую страницу
    const handleBack = useCallback(() => {
        navigate('/test-plan');
    }, [navigate]);

    // Состояние загрузки
    if (loading) {
        return (
            <>
                <Header />
                <main className="main_choice">
                    <div className="loading_container_choice">
                        <div className="loading_spinner_choice"></div>
                        <p>Загрузка теста... Пожалуйста, подождите</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Состояние ошибки
    if (error) {
        return (
            <>
                <Header />
                <main className="main_choice">
                    <div className="error_container_choice">
                        <p>Ошибка загрузки: {error}</p>
                        <p style={{ marginTop: '10px', fontSize: '14px' }}>
                            Не удалось загрузить тест с ID: {id}
                        </p>
                        <button onClick={loadTest}>Повторить попытку</button>
                        <button
                            onClick={handleBack}
                            style={{
                                marginLeft: '10px',
                                backgroundColor: '#6c757d'
                            }}
                        >
                            Вернуться к списку тестов
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Состояние пустого результата
    if (!testData) {
        return (
            <>
                <Header />
                <main className="main_choice">
                    <div className="empty_container_choice">
                        <p>Тест с ID {id} не найден</p>
                        <button onClick={handleBack}>
                            Вернуться к плану тестов
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="main_choice">
                <img src="/img/personal-param-girl.png" alt="girl"/>

                <div className="test_options_choice">
                    <h1>Тестирование</h1>

                    <div className="form_container_choice">
                        <form
                            className="form_group_choice"
                            onSubmit={handleSubmit}
                        >
                            <legend>
                                Выберите часть тела на которую желаете пройти тестирование
                            </legend>

                            {exerciseOptions.length === 0 ? (
                                <div className="empty_container_choice">
                                    <p>В этом тесте пока нет упражнений</p>
                                </div>
                            ) : (
                                <>
                                    {exerciseOptions.map((exercise) => (
                                        <div
                                            key={exercise.id}
                                            className={`radio_choice_test ${
                                                selectedExercise === exercise.id ? 'selected' : ''
                                            }`}
                                            onClick={() => handleRadioChange(exercise.id)}
                                        >
                                            <input
                                                type="radio"
                                                id={`exercise_${exercise.id}`}
                                                name="testing_exercise"
                                                value={exercise.id}
                                                checked={selectedExercise === exercise.id}
                                                onChange={() => handleRadioChange(exercise.id)}
                                            />
                                            <label htmlFor={`exercise_${exercise.id}`}>
                                                {exercise.name}
                                            </label>
                                        </div>
                                    ))}

                                    {formError && (
                                        <div style={{
                                            color: '#dc3545',
                                            textAlign: 'center',
                                            marginTop: '10px',
                                            fontFamily: 'Montserrat-Regular, sans-serif'
                                        }}>
                                            {formError}
                                        </div>
                                    )}

                                    <input
                                        type="submit"
                                        value="Далее"
                                        className="butn_test"
                                        disabled={!selectedExercise || exerciseOptions.length === 0}
                                    />
                                </>
                            )}
                        </form>
                    </div>
                </div>

                <img
                    className="back"
                    src="/img/bg-left.svg"
                    alt="background"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            </main>
            <Footer />
        </>
    );
};

export default TestChoicePage;