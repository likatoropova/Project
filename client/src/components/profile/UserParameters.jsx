// src/components/profile/UserParameters.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import '../../styles/user_parameters.scss';
import DeleteAccountModal from './DeleteAccountModal';

const UserParameters = ({ parameters, phase, onUpdate }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { goals, levels, equipment } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [formData, setFormData] = useState({
        goal_id: parameters?.goal?.id || '',
        level_id: parameters?.level?.id || '',
        equipment_id: parameters?.equipment?.id || '',
        height: parameters?.height || '',
        weight: parameters?.weight || '',
        age: parameters?.age || '',
        gender: parameters?.gender || '',
        training_count: parameters?.training_count || 3
    });

    // Обновляем форму при изменении parameters
    useEffect(() => {
        if (parameters) {
            setFormData({
                goal_id: parameters.goal?.id || '',
                level_id: parameters.level?.id || '',
                equipment_id: parameters.equipment?.id || '',
                height: parameters.height || '',
                weight: parameters.weight || '',
                age: parameters.age || '',
                gender: parameters.gender || '',
                training_count: parameters.training_count || 3
            });
        }
    }, [parameters]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Подготавливаем данные для отправки
        const payload = {
            goal_id: parseInt(formData.goal_id),
            level_id: parseInt(formData.level_id),
            equipment_id: parseInt(formData.equipment_id),
            height: parseFloat(formData.height),
            weight: parseFloat(formData.weight),
            age: parseInt(formData.age),
            gender: formData.gender
        };

        console.log('Sending payload:', payload);

        if (onUpdate) {
            const result = await onUpdate(payload);
            if (result.success) {
                setIsEditing(false);
            } else {
                console.error('Update failed:', result.error);
                alert('Ошибка при сохранении параметров');
            }
        }
    };

    if (!parameters && !isEditing) {
        return (
            <div className="phase_user_parameters_delete_profile">
                <div className="phase_delete_profile">
                    <div className="phase">
                        <p className="current_phase">Текущая фаза</p>
                        <p className="phase_name">{phase?.current_phase?.name || 'A1'}</p>
                    </div>
                    <div className="recommendation">
                        <p className="training_per_week">Параметры не заполнены</p>
                    </div>
                    <button className="delete_profile" onClick={() => setIsEditing(true)}>
                        Заполнить параметры
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="phase_user_parameters_delete_profile">
            <div className="phase_delete_profile">
                <div className="phase">
                    <p className="current_phase">Текущая фаза</p>
                    <p className="phase_name">{phase?.current_phase?.name || 'A1'}</p>
                </div>

                <div className="recommendation">
                    <p className="training_per_week">
                        Вы тренируетесь {formData.training_count || parameters?.training_count || 3} раза в неделю.
                        Вам рекомендуется тренироваться в неделю
                    </p>
                    <p className="recommendation_training_per_week">
                        {phase?.recommended_workouts || 4}
                    </p>
                </div>

                <button className="delete_profile" onClick={() => setShowDeleteAccountModal(true)}>
                    Удалить профиль
                </button>
            </div>
            <div className="user_parameters_form">
                <div className="user_parameters">
                    {/* Левая часть формы */}
                    <div className="goal_sex_age_weight_height">
                        <div className="user_goal">
                            <label htmlFor="goal_id">Цель тренировок</label>
                            <select
                                name="goal_id"
                                id="goal_id"
                                value={formData.goal_id}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="">Выберите цель</option>
                                {goals.map(goal => (
                                    <option key={goal.id} value={goal.id}>
                                        {goal.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="user_sex">
                            <label>Пол</label>
                            <div className="radio_group">
                                <label className="radio_label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.gender === 'male'}
                                        onChange={(e) => handleRadioChange('gender', e.target.value)}
                                        disabled={!isEditing}
                                    />
                                    Мужской
                                </label>
                                <label className="radio_label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.gender === 'female'}
                                        onChange={(e) => handleRadioChange('gender', e.target.value)}
                                        disabled={!isEditing}
                                    />
                                    Женский
                                </label>
                            </div>
                        </div>

                        <div className="age_weight_height">
                            <div className="user_age">
                                <label htmlFor="age">Возраст</label>
                                <input
                                    type="number"
                                    name="age"
                                    id="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="25"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="user_weight">
                                <label htmlFor="weight">Вес</label>
                                <input
                                    type="number"
                                    name="weight"
                                    id="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="70"
                                    step="0.1"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="user_height">
                                <label htmlFor="height">Рост</label>
                                <input
                                    type="number"
                                    name="height"
                                    id="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    placeholder="175"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Правая часть формы */}
                    <div className="equipment_level_training_count">
                        <div className="equipment">
                            <label>Оборудование</label>
                            <div className="radio_group">
                                {equipment.map(eq => (
                                    <label key={eq.id} className="radio_label">
                                        <input
                                            type="radio"
                                            name="equipment_id"
                                            value={eq.id}
                                            checked={formData.equipment_id === eq.id}
                                            onChange={(e) => handleRadioChange('equipment_id', parseInt(e.target.value))}
                                            disabled={!isEditing}
                                        />
                                        {eq.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="level">
                            <label htmlFor="level_id">Уровень подготовки</label>
                            <select
                                name="level_id"
                                id="level_id"
                                value={formData.level_id}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="">Выберите уровень</option>
                                {levels.map(level => (
                                    <option key={level.id} value={level.id}>
                                        {level.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="training_count">
                            <label htmlFor="training_count">Количество тренировок в неделю</label>
                            <input
                                type="number"
                                name="training_count"
                                id="training_count"
                                value={formData.training_count}
                                onChange={handleChange}
                                placeholder="3"
                                min="1"
                                max="7"
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>
                <DeleteAccountModal
                    isOpen={showDeleteAccountModal}
                    onClose={() => setShowDeleteAccountModal(false)}
                    onConfirm={async () => {
                        await handleLogout();
                    }}
                />

                {isEditing ? (
                    <button className="confirm_params" onClick={handleSubmit}>
                        Подтвердить
                    </button>
                ) : (
                    <button className="confirm_params" onClick={() => setIsEditing(true)}>
                        Редактировать параметры
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserParameters;