import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useApi } from '../hooks/useApi';
import { saveAnthropometry } from '../api/userParamsAPI';
import '../styles/training_personal_param_style.css';
import '../styles/header_footer.css';
import '../styles/fonts.css';

const TrainingPersonalParam = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    weight: '',
    height: '',
    equipment_id: ''
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  
  const { execute: executeSaveAnthropometry, loading } = useApi(saveAnthropometry);
  const equipmentOptions = [
    { id: 1, label: 'Зал' },
    { id: 2, label: 'Смешанный' }
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'gender':
        if (!value) return 'Выберите пол';
        break;
      case 'age':
        if (!value) return 'Введите возраст';
        if (value < 1 || value > 120) return 'Введите возраст от 1 до 120 лет';
        break;
      case 'weight':
        if (!value) return 'Введите вес';
        if (value < 20 || value > 300) return 'Введите вес от 20 до 300 кг';
        break;
      case 'height':
        if (!value) return 'Введите рост';
        if (value < 50 || value > 250) return 'Введите рост от 50 до 250 см';
        break;
      case 'equipment_id':
        if (!value) return 'Выберите оборудование';
        break;
      default:
        return '';
    }
    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({ ...prev, gender }));
    if (touchedFields.gender) {
      const error = validateField('gender', gender);
      setErrors(prev => ({ ...prev, gender: error }));
    }
  };

  const handleEquipmentSelect = (equipmentId) => {
    setFormData(prev => ({ ...prev, equipment_id: equipmentId }));
    if (touchedFields.equipment_id) {
      const error = validateField('equipment_id', equipmentId);
      setErrors(prev => ({ ...prev, equipment_id: error }));
    }
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
    setTouchedFields({
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

    const result = await executeSaveAnthropometry({
      gender: formData.gender,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseInt(formData.height),
      equipment_id: parseInt(formData.equipment_id)
    });

    if (result.success) {
      navigate('/training-level');
    }
  };

  const isFormValid = formData.gender && formData.age && formData.weight && formData.height && formData.equipment_id;
  return (
    <>
      <Header />
      <main className='pers_param_main'>
        <section className="hero">
          <button className="back_btn" onClick={() => navigate('/training-goal')}>
            &lt;
          </button>
          <img src="/img/personal-param-girl.png" alt="girl" />
        </section>
        
        <section className="content-section">
          <h1>Ваш фитнес старт</h1>
          <form className="form_container_param" onSubmit={handleSubmit}>
            <legend className="title">Введите Ваши параметры</legend>
            <div className="form_group_param">
              <label>Пол</label>
              <div className="form_choice">
                <div 
                  className={`choice-item ${formData.gender === 'male' ? 'active' : ''}`}
                  onClick={() => handleGenderSelect('male')}
                >
                  <input
                    type="radio"
                    id="man"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={() => {}}
                  />
                  <label htmlFor="man">Мужской</label>
                </div>
                
                <div 
                  className={`choice-item ${formData.gender === 'female' ? 'active' : ''}`}
                  onClick={() => handleGenderSelect('female')}
                >
                  <input
                    type="radio"
                    id="woman"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={() => {}}
                  />
                  <label htmlFor="woman">Женский</label>
                </div>
              </div>
              {errors.gender && touchedFields.gender && (
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
                  className={errors.age && touchedFields.age ? 'error' : ''}
                />
                {errors.age && touchedFields.age && (
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
                  className={errors.weight && touchedFields.weight ? 'error' : ''}
                />
                {errors.weight && touchedFields.weight && (
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
                  className={errors.height && touchedFields.height ? 'error' : ''}
                />
                {errors.height && touchedFields.height && (
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
                    onClick={() => handleEquipmentSelect(equip.id)}
                  >
                    <input
                      type="radio"
                      id={`equip_${equip.id}`}
                      name="equipment"
                      value={equip.id}
                      checked={formData.equipment_id === equip.id}
                      onChange={() => {}}
                    />
                    <label htmlFor={`equip_${equip.id}`}>{equip.label}</label>
                  </div>
                ))}
              </div>
              {errors.equipment_id && touchedFields.equipment_id && (
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