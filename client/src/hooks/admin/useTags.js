// src/hooks/admin/useTags.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { getTags, createTag, updateTag, deleteTag } from '../../api/admin/tagsAPI';
import { useApi } from '../useApi';

export const useTags = () => {
    const [tags, setTags] = useState([]);
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

    // Используем ref для отслеживания, был ли уже запрос
    const isMounted = useRef(true);
    const fetchingRef = useRef(false);

    const { execute: executeGetTags } = useApi(getTags);
    const { execute: executeCreateTag } = useApi(createTag);
    const { execute: executeUpdateTag } = useApi(updateTag);
    const { execute: executeDeleteTag } = useApi(deleteTag);

    const fetchTags = useCallback(async () => {
        // Предотвращаем множественные одновременные запросы
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

            console.log('Fetching tags with params:', params);

            const response = await executeGetTags(params);

            // Проверяем, что компонент все еще смонтирован
            if (!isMounted.current) return;

            console.log('Fetch tags response:', response);

            if (response.success && response.data) {
                const tagsData = response.data.data || [];
                const metaData = response.data.meta || {};

                console.log('Tags data:', tagsData);
                console.log('Meta data:', metaData);

                setTags(tagsData);
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
                setError(response.message || 'Не удалось загрузить теги');
                setTags([]);
            }
        } catch (err) {
            console.error('Error in fetchTags:', err);
            if (isMounted.current) {
                setError(err.message || 'Ошибка загрузки тегов');
                setTags([]);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
            fetchingRef.current = false;
        }
    }, [currentPage, searchQuery, executeGetTags]);

    useEffect(() => {
        isMounted.current = true;
        fetchTags();

        return () => {
            isMounted.current = false;
        };
    }, [fetchTags]);

    const addTag = async (tagData) => {
        try {
            const response = await executeCreateTag(tagData);
            if (response.success) {
                await fetchTags();
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message || response.error };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const editTag = async (id, tagData) => {
        try {
            const response = await executeUpdateTag(id, tagData);
            if (response.success) {
                await fetchTags();
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message || response.error };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const removeTag = async (id) => {
        try {
            const response = await executeDeleteTag(id);
            if (response.success) {
                await fetchTags();
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

    return {
        tags,
        loading,
        error,
        meta,
        searchQuery,
        currentPage,
        fetchTags,
        addTag,
        editTag,
        removeTag,
        handleSearch,
        goToPage
    };
};