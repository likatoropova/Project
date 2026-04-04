// src/context/TestFlowContext.jsx
import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../api/axiosConfig';

const TestFlowContext = createContext(null);

export const useTestFlow = () => {
    const context = useContext(TestFlowContext);
    if (!context) {
        throw new Error('useTestFlow must be used within TestFlowProvider');
    }
    return context;
};

export const TestFlowProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentAttempt, setCurrentAttempt] = useState(null);
    const [currentExercise, setCurrentExercise] = useState(null);

    // Шаг 1: Начать тест
    const startTest = async (testId, isAuthenticated) => {
        setLoading(true);
        setError(null);

        try {
            const url = isAuthenticated
                ? `/tests/${testId}/start`
                : `/guest/tests/${testId}/start`;

            console.log('Starting test with URL:', url);
            const response = await axiosInstance.post(url);

            if (response.data?.success) {
                const { attempt_id, current_exercise } = response.data.data;
                console.log('Setting currentAttempt:', attempt_id);
                console.log('Setting currentExercise:', current_exercise);

                setCurrentAttempt(attempt_id);
                setCurrentExercise(current_exercise);
                return { success: true, attemptId: attempt_id, exercise: current_exercise };
            } else {
                throw new Error(response.data?.message || 'Failed to start test');
            }
        } catch (err) {
            console.error('Start test error:', err);
            let errorMsg = err.response?.data?.message || err.message || 'Ошибка начала теста';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    // Шаг 2: Сохранить результат упражнения
    const saveResult = async (attemptId, exerciseId, resultValue, isAuthenticated) => {
        setLoading(true);
        setError(null);

        try {
            let url;
            let finalAttemptId = attemptId;

            if (isAuthenticated) {
                url = `/test-attempts/${finalAttemptId}/result`;
            } else {
                finalAttemptId = attemptId.replace('guest_', '');
                url = `/guest/test-attempts/${finalAttemptId}/result`;
            }

            console.log('Saving result to URL:', url);
            console.log('Data:', { testing_exercise_id: exerciseId, result_value: parseInt(resultValue, 10) });

            const response = await axiosInstance.post(url, {
                testing_exercise_id: exerciseId,
                result_value: parseInt(resultValue, 10)
            });

            console.log('Save result response:', response.data);

            if (response.data?.success) {
                const { next_exercise, all_exercises_completed } = response.data.data;
                if (next_exercise) {
                    setCurrentExercise(next_exercise);
                } else if (all_exercises_completed) {
                    setCurrentExercise(null);
                }
                return {
                    success: true,
                    nextExercise: next_exercise,
                    allCompleted: all_exercises_completed
                };
            } else {
                throw new Error(response.data?.message || 'Failed to save result');
            }
        } catch (err) {
            console.error('Save result error:', err);
            let errorMsg = err.response?.data?.message || err.message || 'Ошибка сохранения результата';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    // Шаг 3: Завершить тест с пульсом
    const completeTest = async (attemptId, pulse, isAuthenticated) => {
        setLoading(true);
        setError(null);

        try {
            let url;
            let finalAttemptId = attemptId;

            if (isAuthenticated) {
                url = `/test-attempts/${finalAttemptId}/complete`;
            } else {
                finalAttemptId = attemptId.replace('guest_', '');
                url = `/guest/test-attempts/${finalAttemptId}/complete`;
            }

            console.log('Completing test at URL:', url);
            console.log('Pulse:', pulse);

            const response = await axiosInstance.post(url, { pulse: parseInt(pulse, 10) });

            console.log('Complete test response:', response.data);

            if (response.data?.success) {
                setCurrentAttempt(null);
                setCurrentExercise(null);
                return { success: true, data: response.data.data };
            } else {
                throw new Error(response.data?.message || 'Failed to complete test');
            }
        } catch (err) {
            console.error('Complete test error:', err);
            let errorMsg = err.response?.data?.message || err.message || 'Ошибка завершения теста';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setCurrentAttempt(null);
        setCurrentExercise(null);
        setError(null);
        setLoading(false);
    };

    const value = {
        loading,
        error,
        currentAttempt,
        currentExercise,
        startTest,
        saveResult,
        completeTest,
        reset
    };

    return (
        <TestFlowContext.Provider value={value}>
            {children}
        </TestFlowContext.Provider>
    );
};