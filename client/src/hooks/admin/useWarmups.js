// src/hooks/admin/useWarmups.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { getWarmups, deleteWarmup } from '../../api/admin/warmupsAPI';
import { useApi } from '../useApi';

export const useWarmups = () => {
    const [warmups, setWarmups] = useState([]);
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

    const { execute: executeGetWarmups } = useApi(getWarmups);
    const { execute: executeDeleteWarmup } = useApi(deleteWarmup);

    const fetchWarmups = useCallback(async () => {
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

            const response = await executeGetWarmups(params);

            if (!isMounted.current) return;

            if (response.success && response.data) {
                const warmupsData = response.data.data || [];
                const metaData = response.data.meta || {};

                setWarmups(warmupsData);
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
                setError(response.message || 'Не удалось загрузить разминки');
                setWarmups([]);
            }
        } catch (err) {
            console.error('Error in fetchWarmups:', err);
            if (isMounted.current) {
                setError(err.message || 'Ошибка загрузки разминок');
                setWarmups([]);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
            fetchingRef.current = false;
        }
    }, [currentPage, searchQuery, executeGetWarmups]);

    useEffect(() => {
        isMounted.current = true;
        fetchWarmups();

        return () => {
            isMounted.current = false;
        };
    }, [fetchWarmups]);

    const removeWarmup = async (id) => {
        try {
            const response = await executeDeleteWarmup(id);
            if (response.success) {
                await fetchWarmups();
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
        warmups,
        loading,
        error,
        meta,
        searchQuery,
        currentPage,
        fetchWarmups,
        removeWarmup,
        handleSearch,
        goToPage,
        formatDate
    };
};