import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useGuestTest } from '../context/GuestTestContext';
import '../styles/test_exercise_style.css';

const TestExercisePage = () => {
    const { testId } = useParams(); // Получаем только testId из URL
    const navigate = useNavigate();

    const {
        startGuestTest,
        currentExercise,
        testInfo,
        loading,
        error,
        allExercisesCompleted
    } = useGuestTest();

    const [localLoading, setLocalLoading] = useState(true);
    const [localError, setLocalError] = useState(null);

    // Загрузка данных при монтировании
    useEffect(() => {
        const initTest = async () => {
            if (!testId) {
                setLocalError('ID теста не указан');
                setLocalLoading(false);
                return;
            }

            try {
                setLocalLoading(true);
                console.log(`Начинаем тест с ID: ${testId}`);

                const result = await startGuestTest(testId);

                if (!result.success) {
                    setLocalError(result.error || 'Не удалось начать тест');
                }
            } catch (err) {
                console.error('Ошибка при загрузке теста:', err);
                setLocalError(err.message || 'Произошла ошибка при загрузке');
            } finally {
                setLocalLoading(false);
            }
        };

        initTest();
    }, [testId, startGuestTest]);

    // Обработчик кнопки "Назад"
    const handleBack = useCallback(() => {
        navigate('/tests');
    }, [navigate]);

    // Обработчик кнопки "Далее"
    const handleNext = useCallback(() => {
        if (allExercisesCompleted) {
            // Если все упражнения выполнены, переходим на страницу завершения
            navigate(`/test-completed/${testId}`);
        } else {
            // Иначе переходим к выбору результата для следующего упражнения
            navigate(`/test-choice/${testId}`);
        }
    }, [navigate, testId, allExercisesCompleted]);

    // Повторная попытка загрузки
    const handleRetry = useCallback(() => {
        setLocalError(null);
        setLocalLoading(true);
        startGuestTest(testId).finally(() => setLocalLoading(false));
    }, [testId, startGuestTest]);

    // Состояние загрузки
    if (localLoading || loading) {
        return (
            <>
                <Header />
                <main className="main_exercise">
                    <div className="loading_container_exercise">
                        <div className="loading_spinner_exercise"></div>
                        <p>Загрузка упражнения... Пожалуйста, подождите</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Состояние ошибки
    if (localError || error) {
        return (
            <>
                <Header />
                <main className="main_exercise">
                    <div className="error_container_exercise">
                        <p>Ошибка загрузки: {localError || error}</p>
                        <p style={{ marginTop: '10px', fontSize: '14px' }}>
                            Не удалось начать тест. Пожалуйста, попробуйте снова.
                        </p>
                        <button onClick={handleRetry}>Повторить попытку</button>
                        <button onClick={() => navigate('/tests')}>
                            Вернуться к списку тестов
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Состояние пустого результата
    if (!currentExercise) {
        return (
            <>
                <Header />
                <main className="main_exercise">
                    <div className="empty_container_exercise">
                        <p>Упражнение не найдено</p>
                        <button onClick={handleRetry}>Повторить попытку</button>
                        <button onClick={() => navigate('/tests')}>
                            Вернуться к списку тестов
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Формируем путь к изображению
    const imageUrl = currentExercise.image
        ? `http://localhost:8000/storage/${currentExercise.image}${currentExercise.image.endsWith('/') ? '' : '/'}${currentExercise.id}.jpg`
        : '/img/IMG.png';

    return (
        <>
            <Header />
            <main className="main_exercise">
                <section className="hero_exercise">
                    <div className="flex_for_btn_exercise">
                        <button
                            className="back_btn_exercise"
                            onClick={handleBack}
                            aria-label="Назад"
                        >
                            &lt;
                        </button>
                        <h1>{testInfo?.title || 'Тестирование'}</h1>
                    </div>
                    <p>{currentExercise.description || 'Описание упражнения отсутствует'}</p>
                </section>

                <section className="test_container_exercise">
                    <img
                        src={imageUrl}
                        alt="Тестовое упражнение"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/img/IMG.png';
                        }}
                    />

                    <button
                        className="butn_exercise"
                        onClick={handleNext}
                    >
                        {allExercisesCompleted ? 'Завершить тест' : 'Далее'}
                    </button>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default TestExercisePage;