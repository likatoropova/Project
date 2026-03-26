// src/pages/admin/ExerciseForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import {
    createExercise,
    updateExercise,
    getExerciseById,
    uploadExerciseImage,
    getEquipment
} from '../../api/admin/exercisesAPI';
import AdminHeader from '../../components/admin/AdminHeader.jsx';
import '../../styles/admin/exercise_form.scss';

const ExerciseForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        muscle_group: '',
        equipment_id: ''
    });

    const [equipmentList, setEquipmentList] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const { execute: executeCreateExercise } = useApi(createExercise);
    const { execute: executeUpdateExercise } = useApi(updateExercise);
    const { execute: executeGetExercise } = useApi(getExerciseById);
    const { execute: executeUploadImage } = useApi(uploadExerciseImage);
    const { execute: executeGetEquipment } = useApi(getEquipment);

    // Загрузка списка оборудования
    useEffect(() => {
        const fetchEquipment = async () => {
            const response = await executeGetEquipment();
            if (response.success && response.data) {
                setEquipmentList(response.data.data || []);
            }
        };
        fetchEquipment();
    }, [executeGetEquipment]);

    // Загрузка данных упражнения для редактирования
    useEffect(() => {
        if (isEditMode) {
            const fetchExercise = async () => {
                setLoading(true);
                const response = await executeGetExercise(id);
                if (response.success && response.data) {
                    const exerciseData = response.data.data;
                    setFormData({
                        title: exerciseData.title || '',
                        description: exerciseData.description || '',
                        muscle_group: exerciseData.muscle_group || '',
                        equipment_id: exerciseData.equipment?.id || ''
                    });
                    if (exerciseData.image_url) {
                        setImagePreview(exerciseData.image_url);
                    }
                } else {
                    setError('Не удалось загрузить данные упражнения');
                }
                setLoading(false);
            };
            fetchExercise();
        }
    }, [id, isEditMode, executeGetExercise]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleEquipmentChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            equipment_id: value
        }));
        if (validationErrors.equipment_id) {
            setValidationErrors(prev => ({ ...prev, equipment_id: '' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            if (validationErrors.image) {
                setValidationErrors(prev => ({ ...prev, image: '' }));
            }
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.title.trim()) {
            errors.title = 'Введите название упражнения';
        }
        if (!formData.description.trim()) {
            errors.description = 'Введите описание упражнения';
        }
        if (!formData.muscle_group.trim()) {
            errors.muscle_group = 'Введите группу мышц';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        setValidationErrors({});

        try {
            let response;

            if (isEditMode) {
                const updateData = {
                    title: formData.title,
                    description: formData.description,
                    muscle_group: formData.muscle_group,
                    equipment_id: formData.equipment_id || null
                };

                response = await executeUpdateExercise(id, updateData);

                if (response.success && imageFile) {
                    setUploadingImage(true);
                    const uploadResponse = await executeUploadImage(id, imageFile);
                    setUploadingImage(false);

                    if (!uploadResponse.success) {
                        console.warn('Image upload failed:', uploadResponse.error);
                    }
                }
            } else {
                const createData = new FormData();
                createData.append('title', formData.title);
                createData.append('description', formData.description);
                createData.append('muscle_group', formData.muscle_group);
                if (formData.equipment_id) {
                    createData.append('equipment_id', formData.equipment_id);
                }
                if (imageFile) {
                    createData.append('image', imageFile);
                }

                response = await executeCreateExercise(createData);
            }

            if (response.success) {
                navigate('/admin/exercises');
            } else {
                if (response.originalError?.response?.data?.errors) {
                    setValidationErrors(response.originalError.response.data.errors);
                    setError('Пожалуйста, исправьте ошибки в форме');
                } else {
                    setError(response.error || 'Ошибка сохранения упражнения');
                }
            }
        } catch (err) {
            console.error('Submit error:', err);
            setError('Произошла ошибка при сохранении');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/exercises');
    };

    if (loading && isEditMode) {
        return (
            <>
                <AdminHeader />
                <main className="exercise-form-main">
                    <section className="hero">
                        <div className="flex_for_btn">
                            <button className="back_btn" onClick={handleCancel}>←</button>
                            <h1>Упражнения</h1>
                        </div>
                    </section>
                    <div className="loading">Загрузка...</div>
                </main>
            </>
        );
    }

    return (
        <>
            <AdminHeader />
            <main className="exercise-form-main">
                <section className="hero">
                    <div className="flex_for_btn">
                        <button className="back_btn" onClick={handleCancel}>←</button>
                        <h1>{isEditMode ? 'Редактирование упражнения' : 'Создание упражнения'}</h1>
                    </div>
                </section>

                <section className="exrs_form_container">
                    {/* Левая колонка - изображение */}
                    <div className="img_for_sub">
                        <div className="upload_container">
                            <div id="imagePreview" className="image_preview_container">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="preview_image" />
                                ) : (
                                    <div className="image_placeholder">Нет изображения</div>
                                )}
                            </div>
                            <input type="file" id="imageInput" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                            <div className="upload_btn_cont">
                                <p>Загрузить файл:</p>
                                <button type="button" className="upload_btn" onClick={() => document.getElementById('imageInput').click()} disabled={uploadingImage}>
                                    {uploadingImage ? '...' : '+'}
                                </button>
                            </div>
                            <p className="format">jpg формат</p>
                            {validationErrors.image && (
                                <div className="field-error">{validationErrors.image}</div>
                            )}
                        </div>
                    </div>
                    <div className="info_about_exrs_btns">
                        <div className="title_duration_count_description">
                            <div className="container_par_input">
                                <div className="par_input_exrs">
                                    <p>Введите название упражнения *</p>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Отжимания"
                                        className={`exercise_info ${validationErrors.title ? 'error' : ''}`}
                                    />
                                    {validationErrors.title && (
                                        <div className="field-error">{validationErrors.title}</div>
                                    )}
                                </div>
                                <div className="par_input_exrs">
                                    <p>Группа мышц *</p>
                                    <input
                                        type="text"
                                        name="muscle_group"
                                        value={formData.muscle_group}
                                        onChange={handleInputChange}
                                        placeholder="Грудные"
                                        className={`exercise_info ${validationErrors.muscle_group ? 'error' : ''}`}
                                    />
                                    {validationErrors.muscle_group && (
                                        <div className="field-error">{validationErrors.muscle_group}</div>
                                    )}
                                </div>
                                <div className="par_input_exrs">
                                    <p>Оборудование</p>
                                    <select
                                        name="equipment_id"
                                        value={formData.equipment_id}
                                        onChange={handleEquipmentChange}
                                        className="exercise_select"
                                    >
                                        <option value="">Без оборудования</option>
                                        {equipmentList.map(equipment => (
                                            <option key={equipment.id} value={equipment.id}>
                                                {equipment.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </div>
                            <div className="par_input_big">
                                <p>Введите описание упражнения *</p>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Выполняйте данное упражнение 10 раз с весом 50кг...."
                                    className={`exercise_description ${validationErrors.description ? 'error' : ''}`}
                                    rows="5"
                                />
                                {validationErrors.description && (
                                    <div className="field-error">{validationErrors.description}</div>
                                )}
                            </div>
                        </div>

                        <div className="btn_group_exrs">
                            <button
                                type="submit"
                                className="butn_save"
                                onClick={handleSubmit}
                                disabled={loading || uploadingImage}
                            >
                                {loading ? 'Сохранение...' : (uploadingImage ? 'Загрузка...' : 'Сохранить')}
                            </button>
                            <button
                                type="button"
                                className="butn_cancel"
                                onClick={handleCancel}
                            >
                                Отменить
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default ExerciseForm;