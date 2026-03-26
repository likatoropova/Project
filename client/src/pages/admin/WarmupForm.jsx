import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import {
    createWarmup,
    updateWarmup,
    getWarmupById,
    uploadWarmupImage
} from '../../api/admin/warmupsAPI';
import AdminHeader from '../../components/admin/AdminHeader';
import '../../styles/admin/warmup_form.scss';

const WarmupForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const { execute: executeCreateWarmup } = useApi(createWarmup);
    const { execute: executeUpdateWarmup } = useApi(updateWarmup);
    const { execute: executeGetWarmup } = useApi(getWarmupById);
    const { execute: executeUploadImage } = useApi(uploadWarmupImage);

    // Загрузка данных разминки для редактирования
    useEffect(() => {
        if (isEditMode) {
            const fetchWarmup = async () => {
                setLoading(true);
                const response = await executeGetWarmup(id);
                if (response.success && response.data) {
                    const warmupData = response.data.data;
                    setFormData({
                        name: warmupData.name || '',
                        description: warmupData.description || ''
                    });
                    if (warmupData.image_url) {
                        setImagePreview(warmupData.image_url);
                    }
                } else {
                    setError('Не удалось загрузить данные разминки');
                }
                setLoading(false);
            };
            fetchWarmup();
        }
    }, [id, isEditMode, executeGetWarmup]);

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
            errors.name = 'Введите название разминки';
        }
        if (!formData.description.trim()) {
            errors.description = 'Введите описание разминки';
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
                    name: formData.name,
                    description: formData.description
                };

                response = await executeUpdateWarmup(id, updateData);

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
                createData.append('name', formData.name);
                createData.append('description', formData.description);
                if (imageFile) {
                    createData.append('image', imageFile);
                }

                response = await executeCreateWarmup(createData);
            }

            if (response.success) {
                navigate('/admin/warmups');
            } else {
                if (response.originalError?.response?.data?.errors) {
                    setValidationErrors(response.originalError.response.data.errors);
                    setError('Пожалуйста, исправьте ошибки в форме');
                } else {
                    setError(response.error || 'Ошибка сохранения разминки');
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
        navigate('/admin/warmups');
    };

    if (loading && isEditMode) {
        return (
            <>
                <AdminHeader />
                <main className="warmup-form-main">
                    <section className="hero">
                        <div className="flex_for_btn">
                            <button className="back_btn" onClick={handleCancel}>←</button>
                            <h1>Разминка</h1>
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
            <main className="warmup-form-main">
                <section className="hero">
                    <div className="flex_for_btn">
                        <button className="back_btn" onClick={handleCancel}>←</button>
                        <h1>{isEditMode ? 'Редактирование разминки' : 'Создание разминки'}</h1>
                    </div>
                </section>

                <section className="warm_up_form_container">
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
                    <div className="info_about_warm_up_btns">
                        <div className="title_duration_count_description">
                            <div className="container_par_input">
                                <div className="par_input">
                                    <p>Введите название разминки *</p>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Суставная гимнастика"
                                        className={`warmup_info ${validationErrors.name ? 'error' : ''}`}
                                    />
                                    {validationErrors.name && (
                                        <div className="field-error">{validationErrors.name}</div>
                                    )}
                                </div>
                                <div className="par_input_big_wu">
                                    <p>Введите описание разминки *</p>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Разминка для подготовки суставов к нагрузке..."
                                        className={`warmup_description ${validationErrors.description ? 'error' : ''}`}
                                        rows="6"
                                    />
                                    {validationErrors.description && (
                                        <div className="field-error">{validationErrors.description}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="btn_group_warm_up">
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

export default WarmupForm;