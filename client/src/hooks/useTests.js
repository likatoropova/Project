import { useState, useEffect, useCallback, useMemo } from 'react';
import { useApi } from './useApi';
import axiosInstance from '../api/axiosConfig';

export const useTests = (itemsPerPage = 4) => {
    const [tests, setTests] = useState([]);
    const [filteredTests, setFilteredTests] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // состояния для пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPageCount] = useState(itemsPerPage);

    // загрузка с бд
    const { execute: fetchTests, loading, error } = useApi(async () => {
        const response = await axiosInstance.get('/testings');
        return response.data;
    });

    // загрузка тестов
    const loadTests = useCallback(async () => {
        const result = await fetchTests();
        if (result.success && result.data) {
            const testsData = result.data.data || [];
            setTests(testsData);

            // сборщик категорий(тегов)
            const allCategories = new Set();
            testsData.forEach(test => {
                if (test.categories && Array.isArray(test.categories)) {
                    test.categories.forEach(cat => allCategories.add(cat.name));
                }
            });
            setCategories(Array.from(allCategories).sort());
        }
    }, []);

    // загружаем тесты !при монтировании!
    useEffect(() => {
        loadTests();
    }, []);

    // Debounce для поиска
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // фильтрация тестов
    useEffect(() => {
        if (!tests.length) {
            setFilteredTests([]);
            return;
        }

        let filtered = [...tests];

        // поиск
        if (debouncedSearchTerm) {
            const searchLower = debouncedSearchTerm.toLowerCase();
            filtered = filtered.filter(test =>
                test.title.toLowerCase().includes(searchLower)
            );
        }

        // фильтр категорий(тегов)
        if (selectedTags.length > 0) {
            filtered = filtered.filter(test => {
                const testTags = test.categories?.map(cat => cat.name) || [];
                return selectedTags.some(tag => testTags.includes(tag));
            });
        }

        setFilteredTests(filtered);
        // сбрасываем прошлое при изменении фильтров
        setCurrentPage(1);
    }, [tests, debouncedSearchTerm, selectedTags]);

    // вычисляем сколько тестов для пагинации
    const paginatedTests = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPageCount;
        const endIndex = startIndex + itemsPerPageCount;
        return filteredTests.slice(startIndex, endIndex);
    }, [filteredTests, currentPage, itemsPerPageCount]);

    // вычисляем общее количество страниц
    const totalPages = useMemo(() =>
            Math.ceil(filteredTests.length / itemsPerPageCount),
        [filteredTests.length, itemsPerPageCount]
    );

    // функции для пагинации
    const goToPage = useCallback((page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    }, [totalPages]);

    const nextPage = useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    }, [currentPage, totalPages]);

    const prevPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    }, [currentPage]);

    // применение фильтров
    const applyFilters = useCallback((tags) => {
        setSelectedTags(tags);
    }, []);

    // сброс фильтров
    const clearFilters = useCallback(() => {
        setSelectedTags([]);
        setSearchTerm('');
    }, []);

    return {
        // все тесты
        allTests: tests,
        // отфильтрованные тесты
        filteredTests,
        // тесты для текущей страницы
        tests: paginatedTests,
        categories,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        selectedTags,
        applyFilters,
        clearFilters,
        loadTests,
        // пагинация
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
        totalItems: filteredTests.length,
        itemsPerPage: itemsPerPageCount,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
    };
};