import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useGuestTest } from '../context/GuestTestContext';
import '../styles/test_completed_style.scss';

const TestCompletedPage = () => {
    const { attemptId } = useParams(); // attemptId это testId
    const navigate = useNavigate();

    const [pulseValue, setPulseValue] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const {
        completeGuestTest,
        loading,
        error,
        allExercisesCompleted,
        currentExercise
    } = useGuestTest();

    // Проверяем, можно ли завершать тест
    useEffect(() => {
        if (!allExercisesCompleted && currentExercise) {
            // Если не все упражнения выполнены, перенаправляем обратно
            navigate(`/test-exercise/${attemptId}`);
        }
    }, [allExercisesCompleted, currentExercise, navigate, attemptId]);

    const handlePulseChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setPulseValue(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pulseValue) {
            alert('Пожалуйста, введите результат измерения пульса');
            return;
        }

        const pulse = parseInt(pulseValue, 10);
        if (pulse < 30 || pulse > 220) {
            alert('Пожалуйста, введите корректное значение пульса (30-220)');
            return;
        }

        const result = await completeGuestTest(pulse);

        if (result.success) {
            setSubmitSuccess(true);
            setTimeout(() => {
                navigate('/tests');
            }, 2000);
        }
    };

    const handleGoBack = () => {
        navigate(`/test-exercise/${attemptId}`);
    };

    // Если нет attemptId в URL
    if (!attemptId) {
        return (
            <>
                <Header />
                <main>
                    <section className="hero_completed">
                        <div className="flex_for_btn_completed">
                            <button onClick={handleGoBack} className="back_btn_completed">←</button>
                            <h1>Тестирование</h1>
                        </div>
                    </section>
                    <section className="empty_container">
                        <p>Ничего не найдено</p>
                        <Link to="/tests" className="butn">Вернуться к тестам</Link>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main>
                <section className="hero_completed">
                    <div className="flex_for_btn_completed">
                        <button onClick={handleGoBack} className="back_btn_completed">←</button>
                        <h1>Тестирование</h1>
                    </div>
                    <p>
                        Положите два пальца (указательный и средний) на внутреннюю часть запястья или шеи.
                        Посчитайте количество ударов за 6 секунд и умножьте на 10
                    </p>
                </section>

                {submitSuccess ? (
                    <section className="test_container_completed">
                        <div className="success_message" style={{ textAlign: 'center' }}>
                            <p style={{ color: '#4CAF50', fontSize: '18px', marginBottom: '20px' }}>
                                Тест успешно завершен!
                            </p>
                            <p>Перенаправление на страницу тестов...</p>
                        </div>
                    </section>
                ) : (
                    <form onSubmit={handleSubmit} className="test_container_completed">
                        <img src="/img/IMG.png" alt="Измерение пульса" />

                        <input
                            type="text"
                            name="test_result"
                            placeholder="Введите результат"
                            className="test_result_completed"
                            value={pulseValue}
                            onChange={handlePulseChange}
                            disabled={loading}
                            autoComplete="off"
                        />

                        {error && (
                            <div className="error_message" style={{ color: '#f44336', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="butn_completed"
                            disabled={loading || !pulseValue}
                        >
                            {loading ? 'Завершение...' : 'Завершить тест'}
                        </button>
                    </form>
                )}
            </main>
            <Footer />
        </>
    );
};

export default TestCompletedPage;