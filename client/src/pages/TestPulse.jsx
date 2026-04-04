// src/pages/TestPulse.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTestFlow } from '../context/TestFlowContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/test_pulse_style.scss';

const TestPulse = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const testFlow = useTestFlow();
    const [pulse, setPulse] = useState('');

    console.log('TestPulse rendered with attemptId:', attemptId);
    console.log('Current exercise in pulse:', testFlow.currentExercise);
    console.log('Is authenticated:', isAuthenticated);

    useEffect(() => {
        if (testFlow.currentExercise && !testFlow.loading) {
            console.log('Test not completed yet, redirecting to test-do');
            navigate(`/test-do/${attemptId}`);
        }
    }, [testFlow.currentExercise, testFlow.loading, navigate, attemptId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const pulseValue = parseInt(pulse, 10);
        if (!pulseValue || pulseValue < 30 || pulseValue > 220) {
            alert('Пожалуйста, введите корректное значение пульса (30-220)');
            return;
        }

        console.log('Completing test with pulse:', pulseValue);
        const result = await testFlow.completeTest(attemptId, pulseValue, isAuthenticated);
        console.log('Complete test result:', result);

        if (result.success) {
            testFlow.reset();
            console.log('Test completed successfully!');

            if (isAuthenticated) {
                console.log('Redirecting to tests page');
                navigate('/tests', { replace: true });
            } else {
                console.log('Redirecting to register page');
                navigate('/register', {
                    state: {
                        from: 'test',
                        attemptId: attemptId,
                        pulse: pulseValue
                    }
                });
            }
        }
    };

    if (testFlow.loading) {
        return (
            <>
                <Header />
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Завершение теста...</h2>
                    <p>Пожалуйста, подождите</p>
                </div>
                <Footer />
            </>
        );
    }

    if (testFlow.error) {
        return (
            <>
                <Header />
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2 style={{ color: 'red' }}>Ошибка: {testFlow.error}</h2>
                    <button onClick={() => navigate('/tests')}>Вернуться к тестам</button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="main_pulse">
                <h1 className="test_test">Тестирование</h1>
                <p className="pulse_description">
                    Положите два пальца (указательный и средний) на внутреннюю часть запястья или шеи. Посчитайте количество ударов за 6 секунд и умножьте на 10
                </p>

                <form onSubmit={handleSubmit} className="pulse_form">
                    <img src="../../public/img/pulse.png" alt="pulse" className="pulse_image"/>
                    <input
                        type="number"
                        value={pulse}
                        onChange={(e) => setPulse(e.target.value)}
                        placeholder="Введите результат"
                    />

                    {testFlow.error && (
                        <div style={{ color: 'red', margin: '10px 0' }}>{testFlow.error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={testFlow.loading || !pulse}
                            className="pulse_button"
                        >
                            {testFlow.loading ? 'Завершение...' : 'Завершить тест'}
                        </button>
                    </div>
                </form>
            </main>
            <Footer />
        </>
    );
};

export default TestPulse;