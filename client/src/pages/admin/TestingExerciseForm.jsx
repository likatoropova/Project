// src/pages/admin/TestingExerciseForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { createTestingExercise, updateTestingExercise, getTestingExerciseById, uploadTestingExerciseImage } from '../../api/admin/testingExercisesAPI';
import '../../styles/admin/testing_exercise_form.scss';

const TestingExerciseForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const testId = searchParams.get('testId');
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        description: '',
        image: null
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [uploadingImage, setUploadingImage] = useState(false);

    const { execute: executeCreateExercise } = useApi(createTestingExercise);
    const { execute: executeUpdateExercise } = useApi(updateTestingExercise);
    const { execute: executeGetExercise } = useApi(getTestingExerciseById);

    // Загрузка данных упражнения для редактирования
    useEffect(() => {
        if (isEditMode) {
            const fetchExercise = async () => {
                setLoading(true);
                const response = await executeGetExercise(id);
                if (response.success && response.data) {
                    const exerciseData = response.data.data;
                    setFormData({
                        description: exerciseData.description || ''
                    });
                    if (exerciseData.image) {
                        // Если изображение уже есть, показываем его
                        setImagePreview(`http://localhost:8000/storage/${exerciseData.image}`);
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
        setFormData(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
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

    const { execute: executeUploadImage } = useApi(uploadTestingExerciseImage);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Валидация
        const errors = {};
        if (!formData.description.trim()) {
            errors.description = 'Введите описание упражнения';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setLoading(true);
        setError('');
        setValidationErrors({});

        try {
            let response;

            if (isEditMode) {
                // Для редактирования сначала обновляем данные
                const updateData = {
                    description: formData.description
                };

                response = await executeUpdateExercise(id, updateData);

                if (response.success && imageFile) {
                    // Если есть новое изображение, загружаем его
                    setUploadingImage(true);
                    const uploadResponse = await executeUploadImage(id, imageFile);
                    setUploadingImage(false);

                    if (!uploadResponse.success) {
                        console.warn('Image upload failed:', uploadResponse.error);
                    }
                }
            } else {
                // Для создания сначала создаем упражнение
                const createData = new FormData();
                createData.append('description', formData.description);

                if (imageFile) {
                    createData.append('image', imageFile);
                }

                response = await executeCreateExercise(createData);

                // Если создание успешно и есть изображение, но оно не было загружено при создании
                if (response.success && imageFile && !createData.has('image')) {
                    const exerciseId = response.data?.id;
                    if (exerciseId) {
                        setUploadingImage(true);
                        const uploadResponse = await executeUploadImage(exerciseId, imageFile);
                        setUploadingImage(false);

                        if (!uploadResponse.success) {
                            console.warn('Image upload failed:', uploadResponse.error);
                        }
                    }
                }
            }

            if (response.success) {
                // Возвращаемся к упражнениям теста
                if (testId) {
                    navigate(`/admin/tests/${testId}/exercises`);
                } else {
                    navigate('/admin/tests');
                }
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
            setUploadingImage(false);
        }
    };


    const handleCancel = () => {
        if (testId) {
            navigate(`/admin/tests/${testId}/exercises`);
        } else {
            navigate('/admin/tests');
        }
    };

    if (loading && isEditMode) {
        return (
            <div className="exercise-form-container">
                <div className="loading">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="exercise-form-container">
            <div className="form-header">
                <button className="back-btn" onClick={handleCancel}>←</button>
                <h1>{isEditMode ? 'Редактирование упражнения' : 'Создание упражнения'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="exercise-form">
                <div className="form-group">
                    <label>Описание упражнения *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Введите описание упражнения"
                        className={`form-textarea ${validationErrors.description ? 'error' : ''}`}
                        rows="6"
                    />
                    {validationErrors.description && (
                        <div className="field-error">{validationErrors.description}</div>
                    )}
                </div>

                <div className="form-group">
                    <label>Изображение упражнения</label>
                    <div className="image-upload">
                        <div className="image-preview">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" />
                            ) : (
                                <div className="image-placeholder">Нет изображения</div>
                            )}
                        </div>
                        <div className="upload-controls">
                            <p>Загрузить файл:</p>
                            <button type="button" className="upload-btn" onClick={() => document.getElementById('imageInput').click()}>
                                +
                            </button>
                            <input
                                id="imageInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <p className="format-hint">jpg, png формат</p>
                        </div>
                    </div>
                    {validationErrors.image && (
                        <div className="field-error">{validationErrors.image}</div>
                    )}
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={handleCancel}>
                        Отменить
                    </button>
                    <button type="submit" className="btn-submit" disabled={loading || uploadingImage}>
                        {loading ? 'Сохранение...' : (uploadingImage ? 'Загрузка изображения...' : (isEditMode ? 'Сохранить' : 'Создать'))}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TestingExerciseForm;