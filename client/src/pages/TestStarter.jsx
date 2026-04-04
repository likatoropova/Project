import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTestFlow } from '../context/TestFlowContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TestStarter = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const testFlow = useTestFlow(); // <-- вызываем хук
    const started = useRef(false);
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        const init = async () => {
            if (started.current) {
                console.log('Already started, skipping');
                return;
            }

            started.current = true;

            if (!testId) {
                setLocalError('ID теста не указан');
                setTimeout(() => navigate('/tests'), 2000);
                return;
            }

            console.log('Starting test with ID:', testId);
            const result = await testFlow.startTest(testId, isAuthenticated);
            console.log('Start test result:', result);

            if (result.success) {
                console.log('Redirecting to test-do with attemptId:', result.attemptId);
                navigate(`/test-do/${result.attemptId}`, { replace: true });
            } else {
                setLocalError(result.error);
                setTimeout(() => navigate('/tests'), 3000);
            }
        };

        init();
    }, [testId, isAuthenticated, testFlow, navigate]);

    if (testFlow.loading) {
        return (
            <>
                <Header />
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Запуск теста...</h2>
                    <p>Пожалуйста, подождите</p>
                </div>
                <Footer />
            </>
        );
    }

    if (localError || testFlow.error) {
        return (
            <>
                <Header />
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2 style={{ color: 'red' }}>Ошибка</h2>
                    <p>{localError || testFlow.error}</p>
                    <p>Перенаправление на страницу тестов...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Подготовка теста...</h2>
            </div>
            <Footer />
        </>
    );
};

export default TestStarter;