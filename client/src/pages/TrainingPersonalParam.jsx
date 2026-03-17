import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirstTest } from '../context/FirstTestContext';
import { getEquipment, saveAnthropometry } from '../api/userParamsAPI';
import '../styles/training_personal_param_style.scss';
import '../styles/header_footer.scss';
import '../styles/fonts.scss';
import Footer from '../components/Footer';
import Header from '../components/Header';

const TrainingPersonalParam = () => {
  const navigate = useNavigate();
  const { guestId, setGuestIdFromApi } = useFirstTest();
  const [equipmentOptions, setEquipmentOptions] = useState([]);
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
  const [dataLoading, setDataLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');

  // Загружаем список оборудования при монтировании
  useEffect(() => {
    const loadEquipment = async () => {
      const result = await getEquipment();
      if (result.success) {
        setEquipmentOptions(result.data);
      } else {
        setSubmitError('Не удалось загрузить список оборудования');
      }
      setDataLoading(false);
    };
    loadEquipment();
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'gender':
        return !value ? 'Выберите пол' : '';
      case 'age':
        if (!value) return 'Введите возраст';
        if (value < 14 || value > 90) return 'Возраст от 14 до 90 лет';
        return '';
      case 'weight':
        if (!value) return 'Введите вес';
        if (value < 40 || value > 130) return 'Вес от 40 до 130 кг';
        return '';
      case 'height':
        if (!value) return 'Введите рост';
        if (value < 140 || value > 210) return 'Рост от 140 до 210 см';
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
      const result = await saveAnthropometry(formData);
      if (result.success) {
        if (result.data?.data?.guest_id) {
          setGuestIdFromApi(result.data.data.guest_id);
        }
        navigate('/training-level');
      } else {
        setSubmitError(result?.error?.message || 'Ошибка сохранения данных');
      }
    } catch (err) {
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
      <main className='pers_param_main'>
        <section className="hero-pers-param">
          <button
            onClick={() => navigate('/training-goal')}
            disabled={loading}
          >
            <img src="/img/back.svg" alt="back" />
          </button>
          <img src="/img/personal-param-girl.png" alt="girl" />
        </section>
        
        <section className="content-section">
          <h1>Ваш фитнес старт</h1>
          <form className="form_container_param" onSubmit={handleSubmit} noValidate>
            <legend className="title-param">Введите Ваши параметры</legend>
            
            {submitError && (
              <div className="error_message">
                {submitError}
              </div>
            )}
            
            <div className="form_group_param">
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
            
            <div className="form_group_measurements">
              <div>
                <label htmlFor="age">Возраст:</label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  min="14"
                  max="90"
                  value={formData.age}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={errors.age && touched.age ? 'error' : ''}
                  placeholder='лет'
                />
                {errors.age && touched.age && (
                  <span className="field_error">{errors.age}</span>
                )}
              </div>
              
              <div>
                <label htmlFor="weight">Вес:</label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  min="40"
                  max="130"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={errors.weight && touched.weight ? 'error' : ''}
                  placeholder='кг'
                />
                {errors.weight && touched.weight && (
                  <span className="field_error">{errors.weight}</span>
                )}
              </div>
              
              <div>
                <label htmlFor="height">Рост:</label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  min="140"
                  max="210"
                  value={formData.height}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={errors.height && touched.height ? 'error' : ''}
                  placeholder='см'
                />
                {errors.height && touched.height && (
                  <span className="field_error">{errors.height}</span>
                )}
              </div>
            </div>
            
            <div className="form_group_param">
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
                    <label htmlFor={`equip_${equip.id}`}>{equip.name || `Оборудование ${equip.id}`}</label>
                  </div>
                ))}
              </div>
              {errors.equipment_id && touched.equipment_id && (
                <span className="field_error">{errors.equipment_id}</span>
              )}
            </div>
            
            <button
              type="submit"
              className="butn-param"
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