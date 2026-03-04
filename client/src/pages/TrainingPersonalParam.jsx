import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuestTest } from '../context/FirstTestContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/training_personal_param_style.css';
import '../styles/header_footer.css';
import '../styles/fonts.css';

const TrainingPersonalParam = () => {
  const navigate = useNavigate();
  const { guestId, saveGuestAnthropometry, guestData } = useGuestTest();
  
  const [formData, setFormData] = useState({
    gender: guestData?.anthropometry?.gender || '',
    age: guestData?.anthropometry?.age || '',
    weight: guestData?.anthropometry?.weight || '',
    height: guestData?.anthropometry?.height || '',
    equipment_id: guestData?.anthropometry?.equipment_id || ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!guestId) {
      console.log('⏳ Waiting for guest ID...');
    }
  }, [guestId]);

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
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({ ...prev, gender }));
    setErrors(prev => ({ ...prev, gender: '' }));
  };

  const handleEquipmentSelect = (equipmentId) => {
    setFormData(prev => ({ ...prev, equipment_id: equipmentId }));
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
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    saveGuestAnthropometry(formData);
    navigate('/training-level');
  };

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <button className="back_btn" onClick={() => navigate('/training-goal')}>
            &lt;
          </button>
          <img src="/img/personal-param-girl.png" alt="girl" />
        </section>
        
        <section className="content-section">
          <h1>Ваш фитнес старт</h1>
          <form className="form_container" onSubmit={handleSubmit}>
            <legend className="title">Введите Ваши параметры</legend>
            
            <div className="form_group">
              <label>Пол</label>
              <div className="form_choice">
                {['male', 'female'].map(gender => (
                  <div 
                    key={gender}
                    className={`choice-item ${formData.gender === gender ? 'active' : ''}`}
                    onClick={() => handleGenderSelect(gender)}
                  >
                    <input
                      type="radio"
                      name="gender"
                      id={gender}
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={() => {}}
                    />
                    <label htmlFor={gender}>
                      {gender === 'male' ? 'Мужской' : 'Женский'}
                    </label>
                  </div>
                ))}
              </div>
              {errors.gender && <span className="field_error">{errors.gender}</span>}
            </div>
            
            <div className="form_group measurements">
              <div>
                <label htmlFor="age">Возраст (лет):</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.age ? 'error' : ''}
                />
                {errors.age && <span className="field_error">{errors.age}</span>}
              </div>
              
              <div>
                <label htmlFor="weight">Вес (кг):</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.weight ? 'error' : ''}
                />
                {errors.weight && <span className="field_error">{errors.weight}</span>}
              </div>
              
              <div>
                <label htmlFor="height">Рост (см):</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.height ? 'error' : ''}
                />
                {errors.height && <span className="field_error">{errors.height}</span>}
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
                      name="equipment"
                      id={`equip_${equip.id}`}
                      value={equip.id}
                      checked={formData.equipment_id === equip.id}
                      onChange={() => {}}
                    />
                    <label htmlFor={`equip_${equip.id}`}>{equip.label}</label>
                  </div>
                ))}
              </div>
              {errors.equipment_id && <span className="field_error">{errors.equipment_id}</span>}
            </div>
            
            <button type="submit" className="butn">
              Далее
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TrainingPersonalParam;