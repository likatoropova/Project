import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { createTest, updateTest, getTestById, uploadTestImage } from '../../api/admin/testsAPI';
import { getTags } from '../../api/admin/tagsAPI';
import AdminHeader from '../../components/admin/AdminHeader.jsx';
import '../../styles/admin/test_form.scss';

const TestForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration_minutes: '',
        is_active: true
    });

    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [uploadingImage, setUploadingImage] = useState(false);

    const { execute: executeCreateTest } = useApi(createTest);
    const { execute: executeUpdateTest } = useApi(updateTest);
    const { execute: executeGetTest } = useApi(getTestById);
    const { execute: executeGetCategories } = useApi(getTags);
    const { execute: executeUploadImage } = useApi(uploadTestImage);

    // Загрузка категорий
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await executeGetCategories({ per_page: 100 });
            if (response.success && response.data) {
                const categoriesData = response.data.data || [];
                setCategories(categoriesData);
            }
        };
        fetchCategories();
    }, [executeGetCategories]);

    // Загрузка данных теста для редактирования
    useEffect(() => {
        if (isEditMode) {
            const fetchTest = async () => {
                setLoading(true);
                const response = await executeGetTest(id);
                if (response.success && response.data) {
                    const testData = response.data.data;
                    setFormData({
                        title: testData.title || '',
                        description: testData.description || '',
                        duration_minutes: testData.duration_minutes || '',
                        is_active: testData.is_active ?? true
                    });
                    setSelectedCategories(testData.categories?.map(cat => cat.id) || []);
                    if (testData.image) {
                        setImagePreview(`http://localhost:8000/storage/${testData.image}`);
                    }
                } else {
                    setError('Не удалось загрузить данные теста');
                }
                setLoading(false);
            };
            fetchTest();
        }
    }, [id, isEditMode, executeGetTest]);

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

    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Валидация
        const errors = {};
        if (!formData.title.trim()) {
            errors.title = 'Введите название теста';
        }
        if (!formData.description.trim()) {
            errors.description = 'Введите описание теста';
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

                if (imageFile) {
                    const formDataToSend = new FormData();
                    formDataToSend.append('title', formData.title);
                    formDataToSend.append('description', formData.description);
                    formDataToSend.append('duration_minutes', formData.duration_minutes || null);
                    formDataToSend.append('is_active', formData.is_active ? 1 : 0);
                    formDataToSend.append('categories', JSON.stringify(selectedCategories));
                    formDataToSend.append('image', imageFile);

                    response = await executeUpdateTest(id, formDataToSend);
                } else {
                    const updateData = {
                        title: formData.title,
                        description: formData.description,
                        duration_minutes: formData.duration_minutes || null,
                        is_active: Boolean(formData.is_active),
                        categories: selectedCategories
                    };
                    response = await executeUpdateTest(id, updateData);
                }
            } else {

                const createData = new FormData();
                createData.append('title', formData.title);
                createData.append('description', formData.description);
                createData.append('duration_minutes', formData.duration_minutes || null);
                createData.append('is_active', formData.is_active ? 1 : 0);
                createData.append('categories', JSON.stringify(selectedCategories));


                if (imageFile) {
                    createData.append('image', imageFile);
                }

                response = await executeCreateTest(createData);
            }

            if (response.success) {
                navigate('/admin/tests');
            } else {
                if (response.originalError?.response?.data?.errors) {
                    setValidationErrors(response.originalError.response.data.errors);
                    setError('Пожалуйста, исправьте ошибки в форме');
                } else {
                    setError(response.error || 'Ошибка сохранения теста');
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
        navigate('/admin/tests');
    };

    const handleEditExercises = () => {
        navigate(`/admin/tests/${id}/exercises`);
    };

    if (loading && isEditMode) {
        return (
            <>
                <AdminHeader />
                <main className="test-form-main">
                    <section className="hero">
                        <div className="flex_for_btn">
                            <button className="back_btn" onClick={handleCancel}>←</button>
                            <h1>Тестирование</h1>
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
            <main className="test-form-main">
                <section className="hero">
                    <div className="flex_for_btn">
                        <button className="back_btn" onClick={handleCancel}>←</button>
                        <h1>{isEditMode ? 'Редактирование теста' : 'Создание теста'}</h1>
                    </div>
                </section>

                <section className="test_container">
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
                                <button type="button" className="upload_btn" onClick={() => document.getElementById('imageInput').click()}>
                                    +
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
                                    <p>Введите название теста</p>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Расширенная диагностика"
                                        className={`test_info ${validationErrors.title ? 'error' : ''}`}
                                    />
                                    {validationErrors.title && (
                                        <div className="field-error">{validationErrors.title}</div>
                                    )}
                                </div>
                                <div className="par_input">
                                    <p>Введите продолжительность теста</p>
                                    <input
                                        type="text"
                                        name="duration_minutes"
                                        value={formData.duration_minutes}
                                        onChange={handleInputChange}
                                        placeholder="15-20 минут"
                                        className="test_info"
                                    />
                                </div>
                                <div className="par_input">
                                    <p>Введите описание теста</p>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Рекомендуем для старта. Получите персональную программу уже...."
                                        className={`test_description_creat ${validationErrors.description ? 'error' : ''}`}
                                        rows="4"
                                    />
                                    {validationErrors.description && (
                                        <div className="field-error">{validationErrors.description}</div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p>Категории</p>
                                <div className="card_tags">
                                    {categories.map(category => (
                                        <span
                                            key={category.id}
                                            className={`category-tag ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
                                            onClick={() => handleCategoryToggle(category.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {category.name}
                                        </span>
                                    ))}
                                </div>
                                <div className="btn_group">
                                    {isEditMode && (
                                        <button
                                            type="button"
                                            className="butn_edit"
                                            onClick={handleEditExercises}
                                        >
                                            Редактировать упражнение
                                        </button>
                                    )}
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
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default TestForm;