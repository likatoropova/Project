import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getNextExercise } from '../api/workoutAPI';
import '../styles/maximum_definition_style.scss';
import '../styles/header_footer.scss';
import '../styles/fonts.scss';

const MaximumDefinitionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userWorkoutId, exerciseId } = useParams();
    const [weight, setWeight] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const exercise = location.state?.exercise || null;

    useEffect(() => {
        document.title = 'Определение максимума';
    }, []);
    const handleWeightChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setWeight(value);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!weight) {
            setError('Введите вес');
            return;
        }

        if (!exercise) {
            setError('Данные упражнения не найдены');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('📤 Saving weight for exercise:', {
                current_exercise_id: parseInt(exerciseId),
                weight_used: parseInt(weight)
            });

            // Получаем следующее упражнение (это будет текущее упражнение с определенным весом)
            const response = await getNextExercise(
                userWorkoutId,
                parseInt(exerciseId),
                parseInt(weight)
            );

            console.log('✅ Response:', response);

            if (response?.success) {
                const { type, exercise: nextExercise, needs_weight_input } = response.data;

                if (type === 'exercise') {
                    const skippedWarmup = location.state?.skipped_warmup || false;
                    // Переходим к выполнению упражнения, для которого только что определили вес
                    navigate(`/workout-exercise/${userWorkoutId}/${exerciseId}`, {
                        state: { exercise: { ...exercise, weight_used: parseInt(weight) }, skipped_warmup: skippedWarmup }
                    });
                } else if (type === 'completed') {
                    // Тренировка завершена
                    navigate(`/workout-complete/${userWorkoutId}`);
                }
            } else {
                setError(response?.message || 'Ошибка при сохранении веса');
            }
        } catch (err) {
            console.error('❌ Error saving weight:', err);
            setError(err.message || 'Ошибка при сохранении веса');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(`/workout-details/${userWorkoutId}`);
    };

    if (!exercise) {
        return (
            <>
                <Header />
                <main className="main-workout">
                    <div className="error-container">
                        <p className="error-message">Данные упражнения не найдены</p>
                        <button className="back-button" onClick={handleBack}>
                            Вернуться к тренировке
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const exerciseTitle = exercise.title || 'Жим штанги в наклоне';

    return (
        <>
            <Header />
            <main className="main-workout">
                <img src="/img/bg-left.svg" className="bg-left" alt="bg" />

                <section className="definition-cont">
                    <section className="head-definition">
                        <button className="back-btn" onClick={handleBack}>
                            &lt;
                        </button>
                        <div>
                            <h1>Определение максимума</h1>
                            <p className="definition-exercise">{exerciseTitle}</p>
                        </div>
                    </section>

                    <section className="definition-group">
                        <img src="/img/training-image.png" alt="workout" />
                        <p className="description-definition">
                            Введите вес, при котором Вы начинаете ощущать значимую тяжесть
                            во время выполнения упражнения
                        </p>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Введите получившийся результат"
                                value={weight}
                                onChange={handleWeightChange}
                                disabled={loading}
                                className={error ? 'error' : ''}
                            />
                            {error && <span className="field_error">{error}</span>}
                            <button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Сохранение...' : 'Готово'}
                            </button>
                        </form>
                    </section>
                </section>

                <img src="/img/bg-right.svg" className="bg-right" alt="bg" />
            </main>
            <Footer />
        </>
    );
};

export default MaximumDefinitionPage;