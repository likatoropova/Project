import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axiosInstance from '../api/axiosConfig';
import '../styles/test_exercise_style.css';

const TestExercisePage = () => {
    const { testId, exerciseId } = useParams(); // Получаем оба параметра
    const navigate = useNavigate();

    const [attemptData, setAttemptData] = useState(null);
    const [exerciseData, setExerciseData] = useState(null);
    const [testInfo, setTestInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка данных при монтировании
    useEffect(() => {
        const loadTestData = async () => {
            if (!testId) {
                setError('ID теста не указан');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                console.log(`Начинаем тест с ID: ${testId}, упражнение: ${exerciseId}`);
                const response = await axiosInstance.post(`/tests/${testId}/start`);

                console.log('Ответ от сервера:', response);
                console.log('Данные ответа:', response.data);

                if (response.data && response.data.success) {
                    setAttemptData(response.data);

                    // Данные приходят в response.data.data (согласно Swagger)
                    if (response.data.data) {
                        setExerciseData(response.data.data.current_exercise);
                        setTestInfo(response.data.data.testing);
                    } else {
                        setError('Неверная структура данных от сервера');
                    }
                } else {
                    setError(response.data?.message || 'Не удалось начать тест');
                }
            } catch (err) {
                console.error('Ошибка при загрузке теста:', err);
                setError(err.response?.data?.message || err.message || 'Произошла ошибка при загрузке');
            } finally {
                setLoading(false);
            }
        };

        loadTestData();
    }, [testId, exerciseId]);

    // Для отладки - выводим текущее состояние
    useEffect(() => {
        console.log('Текущее состояние:', {
            testId,
            exerciseId,
            loading,
            error,
            attemptData,
            exerciseData,
            testInfo
        });
    }, [testId, exerciseId, loading, error, attemptData, exerciseData, testInfo]);

    // Обработчик кнопки "Назад"
    const handleBack = useCallback(() => {
        navigate(`/test-choice/${testId}`);
    }, [navigate, testId]);

    // Обработчик кнопки "Далее"
    const handleNext = useCallback(() => {
        console.log('Переход к следующему этапу');
        // Здесь будет логика для перехода к следующему упражнению
        navigate(`/test-choice/${testId}`);
    }, [navigate, testId]);

    // Повторная попытка загрузки
    const handleRetry = useCallback(() => {
        window.location.reload();
    }, []);

    // Состояние загрузки
    if (loading) {
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
    if (error) {
        return (
            <>
                <Header />
                <main className="main_exercise">
                    <div className="error_container_exercise">
                        <p>Ошибка загрузки: {error}</p>
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
    if (!exerciseData) {
        return (
            <>
                <Header />
                <main className="main_exercise">
                    <div className="empty_container_exercise">
                        <p>Упражнение не найдено</p>
                        <p style={{ marginTop: '10px', fontSize: '14px' }}>
                            Данные с сервера: {JSON.stringify(attemptData)}
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

    // Формируем путь к изображению
    const imageUrl = exerciseData.image
        ? `http://localhost:8000/storage/${exerciseData.image}${exerciseData.image.endsWith('/') ? '' : '/'}${exerciseData.id}.jpg`
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
                        <h1>Тестирование</h1>
                    </div>
                    <p>{exerciseData.description || 'Описание упражнения отсутствует'}</p>
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

                    <input
                        type="submit"
                        name="button"
                        value="Далее"
                        className="butn_exercise"
                        onClick={handleNext}
                    />
                </section>
            </main>
            <Footer />
        </>
    );
};

export default TestExercisePage;