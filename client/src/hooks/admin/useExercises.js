// src/hooks/admin/useExercises.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { getExercises, deleteExercise } from '../../api/admin/exercisesAPI';
import { useApi } from '../useApi';

export const useExercises = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const isMounted = useRef(true);
    const fetchingRef = useRef(false);

    const { execute: executeGetExercises } = useApi(getExercises);
    const { execute: executeDeleteExercise } = useApi(deleteExercise);

    const fetchExercises = useCallback(async () => {
        if (fetchingRef.current) return;

        try {
            fetchingRef.current = true;
            setLoading(true);
            setError(null);

            const params = {
                page: currentPage,
                per_page: 10,
                ...(searchQuery && { search: searchQuery })
            };

            const response = await executeGetExercises(params);

            if (!isMounted.current) return;

            if (response.success && response.data) {
                const exercisesData = response.data.data || [];
                const metaData = response.data.meta || {};

                setExercises(exercisesData);
                setMeta({
                    current_page: metaData.current_page || 1,
                    last_page: metaData.last_page || 1,
                    per_page: metaData.per_page || 10,
                    total: metaData.total || 0,
                    from: metaData.from || 0,
                    to: metaData.to || 0
                });
                setError(null);
            } else {
                setError(response.message || 'Не удалось загрузить упражнения');
                setExercises([]);
            }
        } catch (err) {
            console.error('Error in fetchExercises:', err);
            if (isMounted.current) {
                setError(err.message || 'Ошибка загрузки упражнений');
                setExercises([]);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
            fetchingRef.current = false;
        }
    }, [currentPage, searchQuery, executeGetExercises]);

    useEffect(() => {
        isMounted.current = true;
        fetchExercises();

        return () => {
            isMounted.current = false;
        };
    }, [fetchExercises]);

    const removeExercise = async (id) => {
        try {
            const response = await executeDeleteExercise(id);
            if (response.success) {
                await fetchExercises();
                return { success: true };
            }
            return { success: false, error: response.message || response.error };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= meta.last_page) {
            setCurrentPage(page);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    return {
        exercises,
        loading,
        error,
        meta,
        searchQuery,
        currentPage,
        fetchExercises,
        removeExercise,
        handleSearch,
        goToPage,
        formatDate
    };
};