import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTestFlow } from '../context/TestFlowContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/test_doer_style.scss';

const TestDoer = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const testFlow = useTestFlow();
    const [selectedValue, setSelectedValue] = useState(null);

    console.log('TestDoer rendered with attemptId:', attemptId);
    console.log('Current exercise from context:', testFlow.currentExercise);
    console.log('Loading:', testFlow.loading);
    console.log('Error:', testFlow.error);

    useEffect(() => {
        console.log('TestDoer useEffect - checking currentExercise');
        if (!testFlow.currentExercise && !testFlow.loading && !testFlow.error) {
            console.log('No currentExercise, redirecting to tests');
            navigate('/tests');
        }
    }, [testFlow.currentExercise, testFlow.loading, testFlow.error, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedValue) {
            alert('Пожалуйста, выберите значение');
            return;
        }

        console.log('Saving result for exercise:', testFlow.currentExercise?.id, 'value:', selectedValue);
        const result = await testFlow.saveResult(attemptId, testFlow.currentExercise.id, selectedValue, isAuthenticated);
        console.log('Save result result:', result);

        if (result.success) {
            if (result.allCompleted) {
                console.log('All exercises completed, going to pulse page');
                setTimeout(() => {
                    navigate(`/test-pulse/${attemptId}`, { replace: true });
                }, 100);
            } else {
                console.log('Next exercise loaded, resetting selection');
                setSelectedValue(null);
            }
        }
    };

    const exerciseOptions = [
        { id: 1, label: '', image: '/img/cant do it.png' },
        { id: 2, label: '', image: '/img/difficult.png' },
        { id: 3, label: '', image: '/img/okey.png' },
        { id: 4, label: '', image: '/img/good.png' },
    ];

    if (testFlow.loading && !testFlow.currentExercise) {
        return (
            <>
                <Header />
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Загрузка упражнения...</h2>
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

    if (!testFlow.currentExercise) {
        return (
            <>
                <Header />
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Загрузка...</h2>
                    <p>Пожалуйста, подождите</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="test_doer_main">
                <div className="test_test_descr">
                    <h1 className="test_test">Тестирование</h1>
                    <p className="test_doer_description">{testFlow.currentExercise.description}</p>
                    <p className="test_doer_description">Выберите своё ощущение после тестирования</p>
                </div>
                <form onSubmit={handleSubmit} className="test_container_doer">
                    <div className="image_radio_group">
                        {exerciseOptions.map(option => (
                            <label
                                key={option.id}
                                className={`image_option ${
                                    selectedValue === option.id ? 'selected' : ''
                                }`}

                            >
                                <input
                                    type="radio"
                                    name="result"
                                    value={option.id}
                                    checked={selectedValue === option.id}
                                    onChange={(e) => setSelectedValue(parseInt(e.target.value))}
                                    style={{visibility: 'hidden'}}
                                />
                                <div>
                                    <img src={option.image} alt={option.label} />
                                    <p>{option.label}</p>
                                </div>
                            </label>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={!selectedValue || testFlow.loading}
                        className="butn_test_doer"
                    >
                        {testFlow.loading ? 'Сохранение...' : 'Далее'}
                    </button>
                </form>
            </main>
            <Footer />
        </>
    );
};

export default TestDoer;