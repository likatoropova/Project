// src/components/admin/RecentItems.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/recent_items.scss';

const RecentItems = ({ title, items, type }) => {
    const navigate = useNavigate();

    const handleItemClick = (id) => {
        if (type === 'test') {
            navigate(`/admin/tests/edit/${id}`);
        } else if (type === 'workout') {
            navigate(`/admin/workouts/edit/${id}`);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const getTags = (item) => {
        if (item.tags && Array.isArray(item.tags)) {
            return item.tags;
        }
        if (item.categories && Array.isArray(item.categories)) {
            return item.categories;
        }
        return [];
    };

    const getDuration = (item) => {
        if (item.duration) {
            return `(${item.duration})`;
        }
        if (item.time) {
            return `(${item.time})`;
        }
        return '';
    };

    return (
        <div className="recent-items">
            <div className="recent-items-header">
                <h3>{title}</h3>
            </div>
            <div className="recent-items-list">
                {items.length === 0 ? (
                    <div className="empty-message">Нет добавленных элементов</div>
                ) : (
                    items.map((item) => {
                        const tags = getTags(item);
                        const duration = getDuration(item);

                        return (
                            <div
                                key={item.id}
                                className="card_recent"
                                onClick={() => handleItemClick(item.id)}
                            >
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="card_image"
                                        onError={(e) => {
                                            e.target.src = '/img/trainings_card1.png';
                                            e.target.onerror = null;
                                        }}
                                    />
                                ) : (
                                    <div className="card_image_placeholder">
                                        <span>Нет изображения</span>
                                    </div>
                                )}

                                <div className="flex">
                                    <h2>{item.title}</h2>
                                    {duration && <p className="card_duration">{duration}</p>}

                                    {tags.length > 0 && (
                                        <div className="card_tags">
                                            {tags.map((tag, index) => (
                                                <span key={index}>
                                                    {typeof tag === 'object' ? tag.name || tag.title : tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {item.description && (
                                        <p className="card_description">
                                            {truncateText(item.description, 120)}
                                        </p>
                                    )}

                                    <p className="card_date">
                                        Добавлено: {formatDate(item.created_at)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default RecentItems;