import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTests } from '../hooks/useTests';
import '../styles/tests_page_style.css';

const TestsPage = () => {
    const navigate = useNavigate();
    const {
        tests,
        filteredTests,
        categories,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        selectedTags,
        applyFilters,
        clearFilters,
        loadTests,
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
        totalItems,
        hasNextPage,
        hasPrevPage
    } = useTests(4); // 4 теста на страницу, можно изменить, но нужно поменять и в хуке!

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [tempSelectedTags, setTempSelectedTags] = useState([]);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // временные теги при открытии фильтра
    useEffect(() => {
        if (isDropdownOpen) {
            setTempSelectedTags(selectedTags);
        }
    }, [isDropdownOpen, selectedTags]);

    // закрытие фильтра при клике вне
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // обработчик фильтров
    const handleApplyFilters = useCallback(() => {
        applyFilters(tempSelectedTags);
        setIsDropdownOpen(false);
    }, [tempSelectedTags, applyFilters]);

    // обработчик сброса фильтров
    const handleClearFilters = useCallback(() => {
        setTempSelectedTags([]);
        clearFilters();
        setIsDropdownOpen(false);
    }, [clearFilters]);

    // обработчик чекбокса
    const handleTagChange = useCallback((tag) => {
        setTempSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    }, []);

    // применение временных фильтров (типо для времени фильтр)
    const formatDuration = useCallback((duration) => {
        if (!duration) return '';
        if (typeof duration === 'string') return duration;
        return `${duration} минут`;
    }, []);

    // обработчик кнопки на главную
    const handleBack = useCallback(() => {
        navigate('/');
    }, [navigate]);

    // генерируем номера страниц для пагинации
    const pageNumbers = useMemo(() => {
        const delta = 2; // сколько страниц показывать слева и справа от текущей
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    }, [currentPage, totalPages]);

    // чтобы тесты в две колонки шли и не ломались
    const renderTestsInColumns = useCallback(() => {
        if (!tests.length) return null;

        const firstColumn = tests.filter((_, index) => index % 2 === 0);
        const secondColumn = tests.filter((_, index) => index % 2 === 1);

        return (
            <>
                <div>
                    {firstColumn.map(test => (
                        <Link
                            key={test.id}
                            to={`/test/${test.id}`}
                            className="card_link"
                        >
                            <div className="card">
                                <img
                                    src={test.image || '/img/IMG.png'}
                                    alt={test.title}
                                    className="card_image"
                                    onError={(e) => {
                                        e.target.src = '/img/IMG.png';
                                    }}
                                />
                                <div className="flex">
                                    <h2>{test.title}</h2>
                                    <p className="duration">
                                        {formatDuration(test.duration_minutes)} минут
                                    </p>
                                    <div className="card_tags">
                                        {test.categories?.map(category => (
                                            <span key={category.id}>{category.name}</span>
                                        ))}
                                    </div>
                                    <p className="description_test">
                                        {test.description || 'Рекомендуем для старта. Получите персональную программу уже сегодня'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div>
                    {secondColumn.map(test => (
                        <Link
                            key={test.id}
                            to={`/test/${test.id}`}
                            className="card_link"
                        >
                            <div className="card">
                                <img
                                    src={test.image || '/img/IMG.png'}
                                    alt={test.title}
                                    className="card_image"
                                    onError={(e) => {
                                        e.target.src = '/img/IMG.png';
                                    }}
                                />
                                <div className="flex">
                                    <h2>{test.title}</h2>
                                    <p className="duration">
                                        {formatDuration(test.duration_minutes)} минут
                                    </p>
                                    <div className="card_tags">
                                        {test.categories?.map(category => (
                                            <span key={category.id}>{category.name}</span>
                                        ))}
                                    </div>
                                    <p className="description_test">
                                        {test.description || 'Рекомендуем для старта. Получите персональную программу уже сегодня'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </>
        );
    }, [tests, formatDuration]);

    // паганиция
    const Pagination = useCallback(() => {
        if (totalPages <= 1) return null;

        return (
            <div className="pagination">
                <button
                    className="pagination_button prev_next"
                    onClick={prevPage}
                    disabled={!hasPrevPage}
                >
                    ← Назад
                </button>

                {pageNumbers.map((page, index) => (
                    page === '...' ? (
                        <span key={`dots-${index}`} className="pagination_ellipsis">...</span>
                    ) : (
                        <button
                            key={page}
                            className={`pagination_button ${currentPage === page ? 'active' : ''}`}
                            onClick={() => goToPage(page)}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    className="pagination_button prev_next"
                    onClick={nextPage}
                    disabled={!hasNextPage}
                >
                    Вперед →
                </button>
            </div>
        );
    }, [currentPage, totalPages, pageNumbers, prevPage, nextPage, goToPage, hasPrevPage, hasNextPage]);

    // отработчик загрузки (когда долгий подсос с бд)
    if (loading) {
        return (
            <>
                <Header />
                <main>
                    <div className="loading_container">
                        <div className="loading_spinner"></div>
                        <p>Загрузка тестов...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }
    // если не получилось загрузить из бд
    if (error) {
        return (
            <>
                <Header />
                <main>
                    <div className="error_container">
                        <p>Ошибка загрузки: {error}</p>
                        <button onClick={loadTests}>Повторить</button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="main_container">
                <section className="hero">
                    <h1>Тесты</h1>
                    <p>
                        Всего несколько быстрых тестов помогут подобрать безопасные
                        и эффективные упражнения для Вашего уровня подготовки.
                        Больше качественных тестов можно открыть, приобретя нашу подписку.
                    </p>
                </section>

                <section className="search_filtration">
                    <div className="search_group">
                        <img src="/img/search.png" alt="search" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Поиск тестов..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="search_group" ref={dropdownRef}>
                        <div className="dropdown">
                            <button
                                className={`dropdown_btn ${selectedTags.length > 0 ? 'active' : ''}`}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                {selectedTags.length > 0
                                    ? `Выбрано: ${selectedTags.length}`
                                    : 'Фильтрация'}
                            </button>
                            <img src="/img/filtr.png" alt="filtration" />

                            <div className={`dropdown_content ${isDropdownOpen ? 'show' : ''}`}>
                                {categories.length === 0 ? (
                                    <div className="dropdown_item">Нет доступных тегов</div>
                                ) : (
                                    categories.map(tag => (
                                        <label key={tag} className="dropdown_item">
                                            <input
                                                type="checkbox"
                                                checked={tempSelectedTags.includes(tag)}
                                                onChange={() => handleTagChange(tag)}
                                            />
                                            <span>{tag}</span>
                                        </label>
                                    ))
                                )}

                                <div className="dropdown_actions">
                                    <button
                                        className="apply_btn"
                                        onClick={handleApplyFilters}
                                        disabled={categories.length === 0}
                                    >
                                        Применить
                                    </button>
                                    <button
                                        className="clear_btn"
                                        onClick={handleClearFilters}
                                    >
                                        Сбросить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="cards_container">
                    {tests.length === 0 ? (
                        <div className="empty_container">
                            <p>Ничего не найдено</p>
                            {(searchTerm || selectedTags.length > 0) && (
                                <button onClick={clearFilters}>Сбросить фильтры</button>
                            )}
                        </div>
                    ) : (
                        renderTestsInColumns()
                    )}
                </section>

                {/* пагинация */}
                <Pagination />
            </main>
            <Footer />
        </>
    );
};

export default TestsPage;