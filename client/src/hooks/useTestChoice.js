// client/src/hooks/useTestChoice.js

import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../api/axiosConfig';


export const useTestChoice = (testId) => {
    const [testData, setTestData] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Используем ref для отслеживания загружен ли уже тест
    const loadedRef = useRef(false);

    // Загрузка данных конкретного теста по ID
    const loadTest = useCallback(async () => {
        // Если тест с таким ID уже загружен и данные есть, не загружаем снова
        if (loadedRef.current && testData && testData.id === parseInt(testId)) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log(`Загрузка теста с ID: ${testId}`);

            // Пытаемся получить данные с API
            const response = await axiosInstance.get(`/testings/${testId}`);

            if (response.data && response.data.success) {
                console.log('Тест загружен успешно:', response.data.data);
                setTestData(response.data.data);
                loadedRef.current = true;

                // Автоматически выбираем первый элемент, если он есть
                if (response.data.data?.exercises?.length > 0) {
                    setSelectedExercise(response.data.data.exercises[0].id.toString());
                }
            }
        } catch (err) {
            console.error('API hook error:', err);

            // В режиме разработки используем моковые данные
            if (import.meta.env.DEV) {
                console.log('Using mock data for development');
                setTestData({
                    ...MOCK_TEST_DATA.data,
                    id: parseInt(testId) // Используем ID из URL
                });
                loadedRef.current = true;

                if (MOCK_TEST_DATA.data?.exercises?.length > 0) {
                    setSelectedExercise(MOCK_TEST_DATA.data.exercises[0].id.toString());
                }
            } else {
                setError(err.message || 'Произошла ошибка при загрузке теста');
            }
        } finally {
            setLoading(false);
        }
    }, [testId]); // Убираем testData из зависимостей

    // Загружаем тест при монтировании или изменении testId
    useEffect(() => {
        // Сбрасываем состояние при изменении ID
        if (testId) {
            loadedRef.current = false;
            setTestData(null);
            setSelectedExercise('');
            loadTest();
        }
    }, [testId]); // loadTest теперь стабильная ссылка

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