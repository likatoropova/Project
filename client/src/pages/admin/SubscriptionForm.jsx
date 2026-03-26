// src/pages/admin/SubscriptionForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import {
    createSubscription,
    updateSubscription,
    getSubscriptionById,
    uploadSubscriptionImage
} from '../../api/admin/subscriptionsAPI';
import AdminHeader from '../../components/admin/AdminHeader.jsx';
import '../../styles/admin/subscription_form.scss';

const SubscriptionForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration_days: '',
        is_active: true
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const { execute: executeCreateSubscription } = useApi(createSubscription);
    const { execute: executeUpdateSubscription } = useApi(updateSubscription);
    const { execute: executeGetSubscription } = useApi(getSubscriptionById);
    const { execute: executeUploadImage } = useApi(uploadSubscriptionImage);

    // Загрузка данных подписки для редактирования
    useEffect(() => {
        if (isEditMode) {
            const fetchSubscription = async () => {
                setLoading(true);
                const response = await executeGetSubscription(id);
                if (response.success && response.data) {
                    const subData = response.data.data;
                    setFormData({
                        name: subData.name || '',
                        description: subData.description || '',
                        price: subData.price || '',
                        duration_days: subData.duration_days || '',
                        is_active: subData.is_active ?? true
                    });
                    if (subData.image_url) {
                        setImagePreview(subData.image_url);
                    }
                } else {
                    setError('Не удалось загрузить данные подписки');
                }
                setLoading(false);
            };
            fetchSubscription();
        }
    }, [id, isEditMode, executeGetSubscription]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Введите название подписки';
        }
        if (!formData.description.trim()) {
            errors.description = 'Введите описание подписки';
        }
        if (!formData.price) {
            errors.price = 'Введите стоимость';
        } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            errors.price = 'Стоимость должна быть положительным числом';
        }
        if (!formData.duration_days) {
            errors.duration_days = 'Введите срок действия (в днях)';
        } else if (isNaN(formData.duration_days) || parseInt(formData.duration_days) <= 0) {
            errors.duration_days = 'Срок действия должен быть положительным числом';
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
            const submitData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                duration_days: parseInt(formData.duration_days),
                is_active: Boolean(formData.is_active)
            };

            let response;
            if (isEditMode) {
                response = await executeUpdateSubscription(id, submitData);
            } else {
                response = await executeCreateSubscription(submitData);
            }

            if (response.success) {
                const subscriptionId = isEditMode ? id : response.data?.id;

                if (imageFile && subscriptionId) {
                    setUploadingImage(true);
                    const uploadResponse = await executeUploadImage(subscriptionId, imageFile);
                    setUploadingImage(false);

                    if (!uploadResponse.success) {
                        console.warn('Image upload failed:', uploadResponse.error);
                    }
                }

                navigate('/admin/subscriptions');
            } else {
                if (response.originalError?.response?.data?.errors) {
                    setValidationErrors(response.originalError.response.data.errors);
                    setError('Пожалуйста, исправьте ошибки в форме');
                } else {
                    setError(response.error || 'Ошибка сохранения подписки');
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
        navigate('/admin/subscriptions');
    };

    if (loading && isEditMode) {
        return (
            <>
                <AdminHeader />
                <main className="subscription-form-main">
                    <section className="hero">
                        <div className="flex_for_btn">
                            <button className="back_btn" onClick={handleCancel}>←</button>
                            <h1>Подписки</h1>
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
            <main className="subscription-form-main">
                <section className="hero">
                    <div className="flex_for_btn">
                        <button className="back_btn" onClick={handleCancel}>←</button>
                        <h1>{isEditMode ? 'Редактирование подписки' : 'Создание подписки'}</h1>
                    </div>
                </section>

                <section className="subscription_container">
                    {/* Левая колонка - изображение */}
                    <div className="img_for_sub">
                        <div className="upload_container">
                            <div id="imagePreview" className="image-preview-container">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="preview_image" />
                                ) : (
                                    <div className="image-placeholder">Нет изображения</div>
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
                    <div className="info_about_sub_btns">
                        <div className="title_duration_count_description">
                            <div className="container_par_input">
                                <div className="par_input">
                                    <p>Введите название подписки *</p>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="1 месяц"
                                        className={`subscription_info ${validationErrors.name ? 'error' : ''}`}
                                    />
                                    {validationErrors.name && (
                                        <div className="field-error">{validationErrors.name}</div>
                                    )}
                                </div>
                                <div className="par_input">
                                    <p>Стоимость (₽) *</p>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="500"
                                        className={`subscription_info ${validationErrors.price ? 'error' : ''}`}
                                        step="0.01"
                                    />
                                    {validationErrors.price && (
                                        <div className="field-error">{validationErrors.price}</div>
                                    )}
                                </div>
                                <div className="par_input">
                                    <p>Срок действия (дни) *</p>
                                    <input
                                        type="number"
                                        name="duration_days"
                                        value={formData.duration_days}
                                        onChange={handleInputChange}
                                        placeholder="30"
                                        className={`subscription_info ${validationErrors.duration_days ? 'error' : ''}`}
                                    />
                                    {validationErrors.duration_days && (
                                        <div className="field-error">{validationErrors.duration_days}</div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p>Введите описание</p>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Расширенный набор тестов для качественной адаптации"
                                    className={`subscription_description ${validationErrors.description ? 'error' : ''}`}
                                    rows="5"
                                />
                                {validationErrors.description && (
                                    <div className="field-error">{validationErrors.description}</div>
                                )}
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                    />
                                    Активна
                                </label>
                            </div>
                        </div>

                        <div className="btn_group_subs">
                            <button
                                type="submit"
                                className="butn_save_subs"
                                onClick={handleSubmit}
                                disabled={loading || uploadingImage}
                            >
                                {loading ? 'Сохранение...' : (uploadingImage ? 'Загрузка...' : 'Сохранить')}
                            </button>
                            <button
                                type="button"
                                className="butn_cancel_subs"
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

export default SubscriptionForm;