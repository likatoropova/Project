import React from 'react';
import '../../styles/subscription_card.scss';

const SubscriptionCard = ({ subscription, onCancel, onRenew }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Извлекаем количество месяцев из названия или duration_days
    const getMonthsCount = () => {
        if (subscription.duration_days) {
            const months = Math.floor(subscription.duration_days / 30);
            return months;
        }
        return 1;
    };

    const monthsCount = getMonthsCount();

    // Форматирование цены
    const formatPrice = (price) => {
        return `${parseFloat(price).toLocaleString('ru-RU')} рублей/мес`;
    };

    return (
        <div className="subscription_profile">
            <div className="card_sub_container_profile">
                <div className="subscription_card_profile">
                    <div className="description_sub_profile">
                        <p className="month_profile">
                            {monthsCount}<span> месяц{monthsCount > 1 ? 'а' : ''}</span>
                        </p>
                        <p className="count_profile">
                            {formatPrice(subscription.price)}
                        </p>
                        <ul>
                            {subscription.features && subscription.features.length > 0 ? (
                                subscription.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))
                            ) : (
                                <>
                                    <li>Расширенный набор тестов для качественной адаптации</li>
                                    <li>Расширенный набор упражнений</li>
                                    <li>Персональные рекомендации</li>
                                </>
                            )}
                        </ul>
                    </div>
                    <img
                        src={subscription.image_url || subscription.image || '/img/sub.png'}
                        alt="subscription"
                        onError={(e) => {
                            e.target.src = '/img/sub.png';
                        }}
                    />
                </div>
            </div>
            <div className="subscription_validity">
                <p className="date_of_end">
                    *<span>Срок действия</span> вашей подписки
                </p>
                <p className="end_date">до {formatDate(subscription.end_date)} г.</p>
                <div className="price_sub">
                    <p className="price_price">{formatPrice(subscription.price)}</p>
                </div>
                <div className="subscription_actions">
                    <button className="btn_renew" onClick={onRenew}>
                        Продлить подписку
                    </button>
                    <button className="btn_cancel" onClick={onCancel}>
                        Отменить подписку
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionCard;