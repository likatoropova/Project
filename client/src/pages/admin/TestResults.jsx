// src/pages/admin/TestResults.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { getTestById } from '../../api/admin/testsAPI';
import '../../styles/admin/test_results.scss';

const TestResults = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { execute: executeGetTest } = useApi(getTestById);

    useEffect(() => {
        const fetchTest = async () => {
            const response = await executeGetTest(id);
            if (response.success && response.data) {
                setTest(response.data.data);
            } else {
                setError('Не удалось загрузить данные теста');
            }
            setLoading(false);
        };
        fetchTest();
    }, [id, executeGetTest]);

    const handleBack = () => {
        navigate('/admin/tests');
    };

    if (loading) {
        return (
            <div className="test-results-container">
                <div className="loading">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="test-results-container">
            <div className="form-header">
                <button className="back-btn" onClick={handleBack}>←</button>
                <h1>{test?.title} - Результаты тестирования</h1>
            </div>

            <div className="results-stats">
                <div className="stat-card">
                    <div className="stat-value">{test?.test_results_count || 0}</div>
                    <div className="stat-label">Всего результатов</div>
                </div>
            </div>

            <div className="results-list">
                {test?.test_results && test.test_results.length > 0 ? (
                    <table className="results-table">
                        <thead>
                        <tr>
                            <th>Пользователь</th>
                            <th>Результат</th>
                            <th>Дата</th>
                        </tr>
                        </thead>
                        <tbody>
                        {test.test_results.map(result => (
                            <tr key={result.id}>
                                <td>{result.user?.name || 'Неизвестно'}</td>
                                <td>{result.result_value}</td>
                                <td>{new Date(result.test_date).toLocaleDateString('ru-RU')}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <p>Нет результатов тестирования</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestResults;