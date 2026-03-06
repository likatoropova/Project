// client/src/components/TestSlider.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const TestSlider = ({ tests }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startIndex, setStartIndex] = useState(0);

    const wrapperRef = useRef(null);
    const containerRef = useRef(null);

    const CARD_WIDTH = 685;
    const GAP = 25;

    // Количество слайдов (сколько раз можно прокрутить)
    const slidesCount = Math.max(0, tests.length - 1);

    // Получение ширины для перемещения
    const getSlideWidth = useCallback(() => {
        return CARD_WIDTH + GAP;
    }, []);

    // Обновление позиции слайдера
    const updateSliderPosition = useCallback((index) => {
        if (index < 0) index = 0;
        if (index > slidesCount) index = slidesCount;

        setCurrentIndex(index);
        if (wrapperRef.current) {
            const slideWidth = getSlideWidth();
            wrapperRef.current.style.transform = `translateX(-${index * slideWidth}px)`;
        }
    }, [slidesCount, getSlideWidth]);

    // Обработчики для drag & drop
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX);
        setStartIndex(currentIndex);
        if (wrapperRef.current) {
            wrapperRef.current.classList.add('dragging');
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const diff = startX - e.pageX;
        const slideWidth = getSlideWidth();
        const moveIndex = Math.round(diff / slideWidth);

        let newIndex = startIndex + moveIndex;
        if (newIndex < 0) newIndex = 0;
        if (newIndex > slidesCount) newIndex = slidesCount;
    };

    const handleMouseUp = (e) => {
        if (!isDragging) return;

        const diff = startX - e.pageX;
        const slideWidth = getSlideWidth();
        const moveIndex = Math.round(diff / slideWidth);

        let newIndex = startIndex + moveIndex;
        if (newIndex < 0) newIndex = 0;
        if (newIndex > slidesCount) newIndex = slidesCount;

        updateSliderPosition(newIndex);

        setIsDragging(false);
        if (wrapperRef.current) {
            wrapperRef.current.classList.remove('dragging');
        }
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            if (wrapperRef.current) {
                wrapperRef.current.classList.remove('dragging');
            }
        }
    };

    // Предотвращение выделения текста при перетаскивании
    const handleDragStart = (e) => {
        e.preventDefault();
    };

    // Обработчик клика по пагинации
    const handlePaginationClick = (index) => {
        updateSliderPosition(index);
    };

    // Форматирование длительности
    const formatDuration = (duration) => {
        if (!duration) return '';
        if (typeof duration === 'string') return duration;
        return `${duration} минут`;
    };

    // Добавляем и удаляем обработчики событий
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (wrapper) {
            wrapper.addEventListener('mousedown', handleMouseDown);
            wrapper.addEventListener('mousemove', handleMouseMove);
            wrapper.addEventListener('mouseup', handleMouseUp);
            wrapper.addEventListener('mouseleave', handleMouseLeave);
            wrapper.addEventListener('dragstart', handleDragStart);

            return () => {
                wrapper.removeEventListener('mousedown', handleMouseDown);
                wrapper.removeEventListener('mousemove', handleMouseMove);
                wrapper.removeEventListener('mouseup', handleMouseUp);
                wrapper.removeEventListener('mouseleave', handleMouseLeave);
                wrapper.removeEventListener('dragstart', handleDragStart);
            };
        }
    }, [isDragging, startX, startIndex, currentIndex, slidesCount, getSlideWidth]);

    // Обновление позиции при изменении размера окна
    useEffect(() => {
        const handleResize = () => {
            updateSliderPosition(currentIndex);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentIndex, updateSliderPosition]);

    if (!tests.length) return null;

    return (
        <>
            <div className="slider-container" ref={containerRef}>
                <div className="slider-wrapper" ref={wrapperRef}>
                    {tests.map((test) => (
                        <Link
                            key={test.id}
                            to={`/tests/${test.id}`}
                            className="card_test"
                            draggable="false"
                        >
                            <img
                                src={test.image || '/img/IMG.png'}
                                alt={test.title}
                                className="card_test_image"
                                onError={(e) => {
                                    e.target.src = '/img/IMG.png';
                                }}
                            />
                            <div className="flex_test">
                                <h2>{test.title}</h2>
                                <p className="test_duration">
                                    ({formatDuration(test.duration_minutes)})
                                </p>
                                <div className="card_test_tags">
                                    {test.categories?.map(category => (
                                        <span key={category.id}>{category.name}</span>
                                    ))}
                                </div>
                                <p className="test_description">
                                    {test.description || 'Рекомендуем для старта. Получите персональную программу уже сегодня'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Пагинация */}
            {tests.length > 1 && (
                <div className="slider-pagination">
                    {Array.from({ length: tests.length - 1 }, (_, i) => (
                        <span
                            key={i}
                            className={`pagination-bar ${currentIndex === i ? 'active' : ''}`}
                            onClick={() => handlePaginationClick(i)}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default TestSlider;