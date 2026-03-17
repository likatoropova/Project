import React, { useEffect, useState } from 'react';
import { processSubscriptionPayment } from '../api/paymentAPI';
import { validators } from '../utils/validators';
import '../styles/modal-payment.scss';

const PaymentModal = ({ isOpen, onClose, subscription, onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedCardData = localStorage.getItem('savedCardData');
      if (savedCardData) {
        try {
          const parsed = JSON.parse(savedCardData);
          setFormData(prev => ({
            ...prev,
            cardNumber: parsed.cardNumber || '',
            cardHolder: parsed.cardHolder || '',
            expiryMonth: parsed.expiryMonth || '',
            expiryYear: parsed.expiryYear || '',
            saveCard: true
          }));
        } catch (e) {
          console.error('Error loading saved card data:', e);
        }
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!formData.saveCard) {
      setFormData({
        cardNumber: '',
        cardHolder: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        saveCard: false
      });
      setErrors({});
      setPaymentError('');
    }
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    const trimmed = numbers.slice(0, 16);
    const parts = [];
    for (let i = 0; i < trimmed.length; i += 4) {
      parts.push(trimmed.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleCardHolderChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-Z\s]/g, '');
    value = value.toUpperCase();
    
    setFormData(prev => ({ ...prev, cardHolder: value }));
    
    if (errors.cardHolder) {
      setErrors(prev => ({ ...prev, cardHolder: null }));
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
    
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: null }));
    }
  };

  const handleExpiryChange = (e) => {
    const { name, value } = e.target;
    const numbers = value.replace(/\D/g, '');
    
    setFormData(prev => ({ ...prev, [name]: numbers }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCvvChange = (e) => {
    const numbers = e.target.value.replace(/\D/g, '').slice(0, 3);
    setFormData(prev => ({ ...prev, cvv: numbers }));
    
    if (errors.cvv) {
      setErrors(prev => ({ ...prev, cvv: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'cardNumber') {
      handleCardNumberChange(e);
    } else if (name === 'cardHolder') {
      handleCardHolderChange(e);
    } else if (name === 'expiryMonth' || name === 'expiryYear') {
      handleExpiryChange(e);
    } else if (name === 'cvv') {
      handleCvvChange(e);
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    setPaymentError('');
  };

  const validateForm = () => {
    const newErrors = {
      cardNumber: validators.cardNumber(formData.cardNumber),
      cardHolder: validators.cardHolder(formData.cardHolder),
      expiryMonth: validators.expiryMonth(formData.expiryMonth),
      expiryYear: validators.expiryYear(formData.expiryYear),
      cvv: validators.cvv(formData.cvv)
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setPaymentError('');

    const paymentData = {
      subscription_id: subscription.id,
      save_card: formData.saveCard,
      use_saved_card: false,
      card_number: formData.cardNumber.replace(/\s/g, ''),
      card_holder: formData.cardHolder,
      expiry_month: formData.expiryMonth.padStart(2, '0'),
      expiry_year: `20${formData.expiryYear}`,
      cvv: formData.cvv
    };

    if (formData.saveCard) {
      const savedCardData = {
        cardNumber: formData.cardNumber,
        cardHolder: formData.cardHolder,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear
      };
      localStorage.setItem('savedCardData', JSON.stringify(savedCardData));
    }

    const result = await processSubscriptionPayment(paymentData);

    if (result.success) {
      onPaymentSuccess(result.data);
      handleClose();
    } else {
      setPaymentError(result.error?.message || 'Ошибка при оплате');
    }

    setLoading(false);
  };

  const previewCardNumber = formData.cardNumber || '#### #### #### ####';
  const previewHolder = formData.cardHolder || 'IVAN IVANOV';
  const previewMonth = formData.expiryMonth ? formData.expiryMonth.padStart(2, '0') : 'MM';
  const previewYear = formData.expiryYear ? formData.expiryYear.padStart(2, '0') : 'YY';

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="modal-cont" onClick={(e) => e.stopPropagation()}>
        <form className="card-preview">
          <input 
            type="text" 
            id="number-card-preview" 
            value={previewCardNumber}
            readOnly 
          />
          <div className="data-preview">
            <div>
              <h4>Держатель карты</h4>
              <p>{previewHolder}</p>
            </div>
            <div>
              <h4>Истекает</h4>
              <p>{previewMonth}/{previewYear}</p>
            </div>
          </div>
        </form>

        <form className="card-cont" onSubmit={handleSubmit}>
           {paymentError && (
            <div className="error_message">
              {paymentError}
            </div>
          )}

          <div>
            <label htmlFor="number-card">Номер карты</label>
            <input 
              type="text" 
              name="cardNumber" 
              id="number-card" 
              placeholder="#### #### #### ####"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength="19"
              disabled={loading}
              className={errors.cardNumber ? 'error' : ''}
            />
            {errors.cardNumber && <span className="field_error">{errors.cardNumber}</span>}
          </div>

          <div>
            <label htmlFor="card-holder">Держатель карты</label>
            <input 
              type="text" 
              name="cardHolder" 
              id="card-holder" 
              placeholder="IVAN IVANOV"
              value={formData.cardHolder}
              onChange={handleChange}
              disabled={loading}
              className={errors.cardHolder ? 'error' : ''}
              style={{ textTransform: 'uppercase' }}
            />
            {errors.cardHolder && <span className="field_error">{errors.cardHolder}</span>}
          </div>

          <div className="verify-param">
            <div>
              <label>Срок действия</label>
              <div>
                <input 
                  type="text" 
                  name="expiryMonth" 
                  id="month" 
                  placeholder="MM"
                  value={formData.expiryMonth}
                  onChange={handleChange}
                  maxLength="2"
                  disabled={loading}
                  className={errors.expiryMonth ? 'error' : ''}
                />
                <input 
                  type="text" 
                  name="expiryYear" 
                  id="year" 
                  placeholder="YY"
                  value={formData.expiryYear}
                  onChange={handleChange}
                  maxLength="2"
                  disabled={loading}
                  className={errors.expiryYear ? 'error' : ''}
                />
              </div>
            </div>

            <div>
              <label htmlFor="cvv">CVV</label>
              <input 
                type="password" 
                name="cvv" 
                id="cvv" 
                placeholder="***"
                value={formData.cvv}
                onChange={handleChange}
                maxLength="3"
                disabled={loading}
                className={errors.cvv ? 'error' : ''}
              />
              {errors.cvv && <span className="field_error">{errors.cvv}</span>}
            </div>
          </div>

          <div className="remember-me">
            <input 
              type="checkbox" 
              id="save-card" 
              name="saveCard"
              checked={formData.saveCard}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="save-card">Запомнить мои данные</label>
          </div>

          <div className="modal-control">
            <button 
              className="btn-pay" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Обработка...' : `Оплатить ${subscription ? formatPrice(subscription.price) : ''}`}
            </button>
            <button 
              className="btn-cancel" 
              type="button" 
              onClick={handleClose}
              disabled={loading}
            >
              Отменить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const formatPrice = (price) => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return `${price} ₽`;
  return `${numPrice} ₽`;
};

export default PaymentModal;