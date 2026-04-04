import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../api/axiosConfig';


export const useTestChoice = (testId) => {
    const [testData, setTestData] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Используем ref для отслеживания загружен ли уже тест
    const loadedRef = useRef(false);

    const loadTest = useCallback(async () => {
        if (loadedRef.current && testData && testData.id === parseInt(testId)) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log(`Загрузка теста с ID: ${testId}`);
            const response = await axiosInstance.get(`/testings/${testId}`);

            if (response.data && response.data.success) {
                console.log('Тест загружен успешно:', response.data.data);
                setTestData(response.data.data);
                loadedRef.current = true;

                if (response.data.data?.test_exercises?.length > 0) {
                    // Обратите внимание: может быть test_exercises, а не exercises
                    const exercises = response.data.data.test_exercises || response.data.data.exercises || [];
                    if (exercises.length > 0) {
                        setSelectedExercise(exercises[0].id.toString());
                    }
                }
            }
        } catch (err) {
            console.error('API hook error:', err);
        } finally {
            setLoading(false);
        }
    }, [testId, testData]);
    console.log('useTestChoice received testId:', testId, typeof testId);

    // Загружаем тест при монтировании или изменении testId
    useEffect(() => {
        if (testId) {
            loadedRef.current = false;
            setTestData(null);
            setSelectedExercise('');
            loadTest();
        }
    }, [testId]);

    // Выбор упражнения
    const selectExercise = useCallback((exerciseId) => {
        setSelectedExercise(exerciseId);
    }, []);

    // Получение названий упражнений для радио кнопок
    const getExerciseOptions = useCallback(() => {
        if (!testData?.exercises) return [];

        return testData.exercises.map(exercise => ({
            id: exercise.id.toString(),
            name: exercise.description || `Упражнение ${exercise.order_number}`,
            description: exercise.description,
            order_number: exercise.order_number
        }));
    }, [testData]);

    return {
        testData,
        loading,
        error,
        loadTest,
        selectedExercise,
        selectExercise,
        getExerciseOptions
    };
};