import { useState, useEffect, useCallback, useRef } from 'react';
import { getSubscriptions, deleteSubscription } from '../../api/admin/subscriptionsAPI';
import { useApi } from '../useApi';

export const useSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
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

    const { execute: executeGetSubscriptions } = useApi(getSubscriptions);
    const { execute: executeDeleteSubscription } = useApi(deleteSubscription);

    const fetchSubscriptions = useCallback(async () => {
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

            const response = await executeGetSubscriptions(params);

            if (!isMounted.current) return;

            if (response.success && response.data) {
                const subscriptionsData = response.data.data || [];
                const metaData = response.data.meta || {};

                setSubscriptions(subscriptionsData);
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
                setError(response.message || 'Не удалось загрузить подписки');
                setSubscriptions([]);
            }
        } catch (err) {
            console.error('Error in fetchSubscriptions:', err);
            if (isMounted.current) {
                setError(err.message || 'Ошибка загрузки подписок');
                setSubscriptions([]);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
            fetchingRef.current = false;
        }
    }, [currentPage, searchQuery, executeGetSubscriptions]);

    useEffect(() => {
        isMounted.current = true;
        fetchSubscriptions();

        return () => {
            isMounted.current = false;
        };
    }, [fetchSubscriptions]);

    const removeSubscription = async (id) => {
        try {
            const response = await executeDeleteSubscription(id);
            if (response.success) {
                await fetchSubscriptions();
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

    const formatPrice = (price) => {
        return `${price} ₽`;
    };

    return {
        subscriptions,
        loading,
        error,
        meta,
        searchQuery,
        currentPage,
        fetchSubscriptions,
        removeSubscription,
        handleSearch,
        goToPage,
        formatDate,
        formatPrice
    };
};