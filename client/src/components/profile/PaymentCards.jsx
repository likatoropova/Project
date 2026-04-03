// src/components/profile/PaymentCards.jsx

import React, { useState } from 'react';
import PaymentModal from '../PaymentModal';
import '../../styles/payment_cards.scss';

const PaymentCards = ({ cards, onAddCard }) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleSetDefault = (cardId) => {
        // API call to set default card
        console.log('Set default card:', cardId);
    };

    const handleRemoveCard = (cardId) => {
        // API call to remove card
        console.log('Remove card:', cardId);
    };

    const handlePaymentSuccess = (data) => {
        console.log('Payment success:', data);
    };

    return (
        <div className="user_cards">
            <h2 className="my_cards">Мои карты</h2>

            {cards.map((card) => (
                <div key={card.id} className="user_card">
                    <div className="card_img_info">
                        <img src="/img/card.png" alt="card" className="card_img" />
                        <div className="card_info">
                            <div className="number_date_end">
                                <p className="number_card">**** {card.card_last_four}</p>
                                <p className="card_date_end">{card.expiry_formatted || '01/54'}</p>
                            </div>
                            <p className="card_user_name">{card.card_holder || 'CARD HOLDER'}</p>
                        </div>
                    </div>
                    <div className="delete_select">
                        {!card.is_default && (
                            <button
                                className="delete_card"
                                onClick={() => handleRemoveCard(card.id)}
                            >
                                x
                            </button>
                        )}
                        <button
                            className={`select_card ${card.is_default ? 'active' : ''}`}
                            onClick={() => handleSetDefault(card.id)}
                        >
                            {card.is_default ? 'Основная карта' : 'Сделать основной'}
                        </button>
                    </div>
                </div>
            ))}

            <div className="add_card" onClick={() => setShowPaymentModal(true)}>
                <p>Добавить карту</p>
                <img src="/img/add.svg" alt="add" />
            </div>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                subscription={null}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </div>
    );
};

export default PaymentCards;