// client/src/pages/TestPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useGuestTest } from '../context/GuestTestContext';
import '../styles/test_style.css';

const TestPage = () => {
    const { attemptId } = useParams(); // attemptId теперь это testId
    const navigate = useNavigate();

    const [selectedValue, setSelectedValue] = useState('');
    const [resultSaved, setResultSaved] = useState(false);
    const [localError, setLocalError] = useState(null);

    const {
        currentExercise,
        testInfo,
        saveExerciseResult,
        loading,
        error,
        validationErrors,
        allExercisesCompleted
    } = useGuestTest();

    // Проверяем, есть ли активное упражнение
    useEffect(() => {
        if (!currentExercise && !loading && !error) {
            // Если нет текущего упражнения, перенаправляем на начало теста
            navigate(`/test-exercise/${attemptId}`);
        }
    }, [currentExercise, loading, error, navigate, attemptId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedValue) {
            alert('Пожалуйста, выберите значение');
            return;
        }

        setLocalError(null);

        // Преобразуем значение в число
        const numericValue = parseInt(selectedValue, 10);

        // Проверяем, что это число
        if (isNaN(numericValue)) {
            setLocalError('Пожалуйста, выберите корректное значение');
            return;
        }

        console.log('Submitting result:', numericValue);
        console.log('Current exercise ID:', currentExercise?.id);

        const result = await saveExerciseResult(numericValue);

        if (result.success) {
            setResultSaved(true);

            if (result.allCompleted) {
                // Если все упражнения выполнены, перенаправляем на страницу завершения
                setTimeout(() => {
                    navigate(`/test-completed/${attemptId}`);
                }, 1500);
            } else if (result.nextExercise) {
                // Показываем сообщение и перенаправляем обратно на страницу упражнения
                setTimeout(() => {
                    navigate(`/test-exercise/${attemptId}`);
                }, 1500);
            }
        } else {
            setLocalError(result.error || 'Ошибка при сохранении результата');
        }
    };

    const handleGoBack = () => {
        navigate(`/test-exercise/${attemptId}`);
    };

    // Форматируем сообщение об ошибке для отображения
    const getFormattedErrorMessage = () => {
        if (validationErrors) {
            // Преобразуем объект ошибок в читаемый текст
            const errorMessages = [];
            for (const [field, messages] of Object.entries(validationErrors)) {
                if (Array.isArray(messages)) {
                    errorMessages.push(`${field}: ${messages.join(', ')}`);
                } else {
                    errorMessages.push(`${field}: ${messages}`);
                }
            }
            return errorMessages.join('; ');
        }
        return error || localError;
    };

    // Если результат сохранен, показываем сообщение
    if (resultSaved) {
        return (
            <>
                <Header />
                <main>
                    <section className="hero_pulse">
                        <div className="flex_for_btn_pulse">
                            <button className="back_btn_pulse" onClick={handleGoBack}>&lt;</button>
                            <h1>Тестирование</h1>
                        </div>
                    </section>
                    <section className="test_container_pulse">
                        <div className="success-message" style={{ textAlign: 'center', padding: '40px' }}>
                            <p style={{ color: '#4CAF50', fontSize: '18px', marginBottom: '20px' }}>
                                Результат успешно сохранен!
                            </p>
                            {allExercisesCompleted ? (
                                <p>Перенаправление на страницу завершения теста...</p>
                            ) : (
                                <p>Перенаправление к следующему упражнению...</p>
                            )}
                        </div>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    // Обработка загрузки
    if (loading) {
        return (
            <>
                <Header />
                <main>
                    <div className="loading-spinner" style={{ textAlign: 'center', padding: '50px' }}>
                        <p>Загрузка теста...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Обработка ошибки
    if (error || localError) {
        return (
            <>
                <Header />
                <main className="main_pulse">
                    <section className="hero_pulse">
                        <div className="flex_for_btn_pulse">
                            <button className="back_btn_pulse" onClick={handleGoBack}>&lt;</button>
                            <h1>Тестирование</h1>
                        </div>
                    </section>
                    <section className="test_container_pulse">
                        <div className="error-message" style={{ textAlign: 'center', padding: '40px' }}>
                            <p style={{ color: '#f44336', fontSize: '16px', marginBottom: '15px' }}>
                                {error || localError}
                            </p>

                            {/* Отображаем детальные ошибки валидации, если есть */}
                            {validationErrors && (
                                <div style={{
                                    marginTop: '20px',
                                    textAlign: 'left',
                                    background: '#fff3f3',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    border: '1px solid #ffcdd2'
                                }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#d32f2f' }}>
                                        Детали ошибки:
                                    </p>
                                    <ul style={{ paddingLeft: '20px' }}>
                                        {Object.entries(validationErrors).map(([field, messages]) => (
                                            <li key={field} style={{ marginBottom: '8px', color: '#666' }}>
                                                <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
                                            </li>
                                        ))}
                                    </ul>
                                    <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                                        Пожалуйста, попробуйте снова или обратитесь в поддержку.
                                    </p>
                                </div>
                            )}

                            <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <button
                                    className="butn_pulse"
                                    onClick={() => window.location.reload()}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#f44336',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Попробовать снова
                                </button>
                                <button
                                    onClick={() => navigate('/tests')}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#9e9e9e',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Вернуться к тестам
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    // Если нет текущего упражнения
    if (!currentExercise) {
        return null; // useEffect перенаправит
    }

    // Создаем массив вариантов на основе описания упражнения
    const exerciseOptions = [
        { id: 1, description: 'Не могу выполнить', image: '/img/exercise-1.png' },
        { id: 2, description: 'Выполняю с трудом', image: '/img/exercise-2.png' },
        { id: 3, description: 'Выполняю уверенно', image: '/img/exercise-3.png' },
        { id: 4, description: 'Выполняю легко', image: '/img/exercise-4.png' },
    ];

    return (
        <>
            <Header />
            <main>
                <section className="hero_pulse">
                    <div className="flex_for_btn_pulse">
                        <button className="back_btn_pulse" onClick={handleGoBack}>&lt;</button>
                        <h1>Тестирование</h1>
                    </div>
                    <p>{currentExercise.description || 'Выберите своё положение, которое Вы смогли достичь'}</p>
                </section>

                <section className="test_container_pulse">
                    <form id="imageSelectForm" onSubmit={handleSubmit}>
                        <div className="image_radio_group">
                            {exerciseOptions.map((option, index) => (
                                <label
                                    key={option.id}
                                    className={`image_option ${selectedValue === String(option.id) ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="selectedImage"
                                        value={option.id}
                                        checked={selectedValue === String(option.id)}
                                        onChange={(e) => setSelectedValue(e.target.value)}
                                        required
                                    />
                                    <img
                                        src={option.image}
                                        alt={option.description}
                                        className="nebo nebo--bl"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/img/IMG.png';
                                        }}
                                    />
                                    <p className="circle">{index + 1}</p>
                                </label>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="butn_pulse"
                            disabled={!selectedValue || loading}
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </form>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default TestPage;