// src/hooks/admin/useTests.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { getTests, deleteTest } from '../../api/admin/testsAPI';
import { useApi } from '../useApi';

export const useTests = () => {
    const [tests, setTests] = useState([]);
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
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);

    const isMounted = useRef(true);
    const fetchingRef = useRef(false);

    const { execute: executeGetTests } = useApi(getTests);
    const { execute: executeDeleteTest } = useApi(deleteTest);

    const fetchTests = useCallback(async () => {
        if (fetchingRef.current) return;

        try {
            fetchingRef.current = true;
            setLoading(true);
            setError(null);

            const params = {
                page: currentPage,
                per_page: 10,
                ...(searchQuery && { search: searchQuery }),
                ...(selectedCategory && { category_id: selectedCategory })
            };

            const response = await executeGetTests(params);

            if (!isMounted.current) return;

            if (response.success && response.data) {
                const testsData = response.data.data || [];
                const metaData = response.data.meta || {};

                setTests(testsData);
                setMeta({
                    current_page: metaData.current_page || 1,
                    last_page: metaData.last_page || 1,
                    per_page: metaData.per_page || 10,
                    total: metaData.total || 0,
                    from: metaData.from || 0,
                    to: metaData.to || 0
                });

                // Собираем уникальные категории из всех тестов
                const allCategories = [];
                testsData.forEach(test => {
                    if (test.categories && Array.isArray(test.categories)) {
                        test.categories.forEach(cat => {
                            if (!allCategories.find(c => c.id === cat.id)) {
                                allCategories.push(cat);
                            }
                        });
                    }
                });
                setCategories(allCategories);

                setError(null);
            } else {
                setError(response.message || 'Не удалось загрузить тесты');
                setTests([]);
            }
        } catch (err) {
            console.error('Error in fetchTests:', err);
            if (isMounted.current) {
                setError(err.message || 'Ошибка загрузки тестов');
                setTests([]);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
            fetchingRef.current = false;
        }
    }, [currentPage, searchQuery, selectedCategory, executeGetTests]);

    useEffect(() => {
        isMounted.current = true;
        fetchTests();

        return () => {
            isMounted.current = false;
        };
    }, [fetchTests]);

    const removeTest = async (id) => {
        try {
            const response = await executeDeleteTest(id);
            if (response.success) {
                await fetchTests();
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

    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId);
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
        tests,
        loading,
        error,
        meta,
        searchQuery,
        currentPage,
        selectedCategory,
        categories,
        fetchTests,
        removeTest,
        handleSearch,
        handleCategoryFilter,
        goToPage,
        formatDate
    };
};