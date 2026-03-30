// src/hooks/admin/useWorkoutsAdmin.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { getWorkouts, deleteWorkout } from '../../api/admin/workoutsAPI';
import { useApi } from '../useApi';

export const useWorkoutsAdmin = () => {
    const [workouts, setWorkouts] = useState([]);
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

    const { execute: executeGetWorkouts } = useApi(getWorkouts);
    const { execute: executeDeleteWorkout } = useApi(deleteWorkout);

    const fetchWorkouts = useCallback(async () => {
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

            const response = await executeGetWorkouts(params);

            if (!isMounted.current) return;

            if (response.success && response.data) {
                const workoutsData = response.data.data || [];
                const metaData = response.data.meta || {};

                setWorkouts(workoutsData);
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
                setError(response.message || 'Не удалось загрузить тренировки');
                setWorkouts([]);
            }
        } catch (err) {
            console.error('Error in fetchWorkouts:', err);
            if (isMounted.current) {
                setError(err.message || 'Ошибка загрузки тренировок');
                setWorkouts([]);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
            fetchingRef.current = false;
        }
    }, [currentPage, searchQuery, executeGetWorkouts]);

    useEffect(() => {
        isMounted.current = true;
        fetchWorkouts();

        return () => {
            isMounted.current = false;
        };
    }, [fetchWorkouts]);

    const removeWorkout = async (id) => {
        try {
            const response = await executeDeleteWorkout(id);
            if (response.success) {
                await fetchWorkouts();
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

    const formatDuration = (minutes) => {
        if (!minutes) return '';
        return `${minutes} мин`;
    };

    return {
        workouts,
        loading,
        error,
        meta,
        searchQuery,
        currentPage,
        fetchWorkouts,
        removeWorkout,
        handleSearch,
        goToPage,
        formatDate,
        formatDuration
    };
};