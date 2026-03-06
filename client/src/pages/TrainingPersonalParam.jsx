import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirstTest } from '../context/FirstTestContext';
import { saveAnthropometry } from '../api/userParamsAPI';
import '../styles/training_personal_param_style.css';
import '../styles/header_footer.css';
import '../styles/fonts.css';
import Footer from '../components/Footer';
import Header from '../components/Header';

const TrainingPersonalParam = () => {
  const navigate = useNavigate();
  const { guestId, setGuestIdFromApi } = useFirstTest();
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    weight: '',
    height: '',
    equipment_id: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const equipmentOptions = [
    { id: 1, label: 'Зал' },
    { id: 2, label: 'Смешанный' }
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'gender':
        return !value ? 'Выберите пол' : '';
      case 'age':
        if (!value) return 'Введите возраст';
        if (value < 1 || value > 120) return 'Возраст от 1 до 120 лет';
        return '';
      case 'weight':
        if (!value) return 'Введите вес';
        if (value < 20 || value > 300) return 'Вес от 20 до 300 кг';
        return '';
      case 'height':
        if (!value) return 'Введите рост';
        if (value < 50 || value > 250) return 'Рост от 50 до 250 см';
        return '';
      case 'equipment_id':
        return !value ? 'Выберите оборудование' : '';
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({ ...prev, gender }));
    setTouched(prev => ({ ...prev, gender: true }));
    setErrors(prev => ({ ...prev, gender: '' }));
  };

  const handleEquipmentSelect = (equipmentId) => {
    setFormData(prev => ({ ...prev, equipment_id: equipmentId }));
    setTouched(prev => ({ ...prev, equipment_id: true }));
    setErrors(prev => ({ ...prev, equipment_id: '' }));
  };

  const validateForm = () => {
    const newErrors = {
      gender: validateField('gender', formData.gender),
      age: validateField('age', formData.age),
      weight: validateField('weight', formData.weight),
      height: validateField('height', formData.height),
      equipment_id: validateField('equipment_id', formData.equipment_id)
    };
    
    setErrors(newErrors);
    setTouched({
      gender: true,
      age: true,
      weight: true,
      height: true,
      equipment_id: true
    });
    
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      console.log('📤 Saving anthropometry with guest ID:', guestId);
      
      const result = await saveAnthropometry(formData);
      console.log('📥 Save result:', result);

      if (result.success) {
        // Если в ответе есть новый guest_id, сохраняем его
        if (result.data?.data?.guest_id) {
          setGuestIdFromApi(result.data.data.guest_id);
        }
        navigate('/training-level');
      } else {
        setSubmitError(result?.error?.message || 'Ошибка сохранения данных');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setSubmitError('Произошла ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.gender && formData.age && formData.weight && 
  formData.height && formData.equipment_id;

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <button 
            className="back_btn" 
            onClick={() => navigate('/training-goal')}
            disabled={loading}
          >
            &lt;
          </button>
          <img src="/img/personal-param-girl.png" alt="girl" />
        </section>
        
        <section className="content-section">
          <h1>Ваш фитнес старт</h1>
          <form className="form_container" onSubmit={handleSubmit} noValidate>
            <legend className="title">Введите Ваши параметры</legend>
            
            {submitError && (
              <div className="error_message">
                {submitError}
              </div>
            )}
            
            <div className="form_group">
              <label>Пол</label>
              <div className="form_choice">
                <div 
                  className={`choice-item ${formData.gender === 'male' ? 'active' : ''}`}
                  onClick={() => !loading && handleGenderSelect('male')}
                >
                  <input
                    type="radio"
                    id="man"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={() => {}}
                    disabled={loading}
                  />
                  <label htmlFor="man">Мужской</label>
                </div>
                
                <div 
                  className={`choice-item ${formData.gender === 'female' ? 'active' : ''}`}
                  onClick={() => !loading && handleGenderSelect('female')}
                >
                  <input
                    type="radio"
                    id="woman"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={() => {}}
                    disabled={loading}
                  />
                  <label htmlFor="woman">Женский</label>
                </div>
              </div>
              {errors.gender && touched.gender && (
                <span className="field_error">{errors.gender}</span>
              )}
            </div>
            
            <div className="form_group measurements">
              <div>
                <label htmlFor="age">Возраст (лет):</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={errors.age && touched.age ? 'error' : ''}
                />
                {errors.age && touched.age && (
                  <span className="field_error">{errors.age}</span>
                )}
              </div>
              
              <div>
                <label htmlFor="weight">Вес (кг):</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  min="1"
                  max="300"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={errors.weight && touched.weight ? 'error' : ''}
                />
                {errors.weight && touched.weight && (
                  <span className="field_error">{errors.weight}</span>
                )}
              </div>
              
              <div>
                <label htmlFor="height">Рост (см):</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  min="50"
                  max="250"
                  value={formData.height}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={errors.height && touched.height ? 'error' : ''}
                />
                {errors.height && touched.height && (
                  <span className="field_error">{errors.height}</span>
                )}
              </div>
            </div>
            
            <div className="form_group">
              <label>Оборудование</label>
              <div className="form_choice">
                {equipmentOptions.map(equip => (
                  <div 
                    key={equip.id}
                    className={`choice-item ${formData.equipment_id === equip.id ? 'active' : ''}`}
                    onClick={() => !loading && handleEquipmentSelect(equip.id)}
                  >
                    <input
                      type="radio"
                      id={`equip_${equip.id}`}
                      name="equipment"
                      value={equip.id}
                      checked={formData.equipment_id === equip.id}
                      onChange={() => {}}
                      disabled={loading}
                    />
                    <label htmlFor={`equip_${equip.id}`}>{equip.label}</label>
                  </div>
                ))}
              </div>
              {errors.equipment_id && touched.equipment_id && (
                <span className="field_error">{errors.equipment_id}</span>
              )}
            </div>
            
            <button
              type="submit"
              className="butn"
              disabled={loading || !isFormValid}
            >
              {loading ? 'Сохранение...' : 'Далее'}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TrainingPersonalParam;