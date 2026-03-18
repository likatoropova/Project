import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTestPlan } from '../hooks/useTestPlan';
import '../styles/test_plan_style.css';

const TestPlanPage = () => {
    const navigate = useNavigate();
    const { tests, loading, error, loadTests, formatDuration } = useTestPlan();

    // Обработчик возврата на предыдущую страницу
    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    // Рендер карточек тестов
    const renderTests = useCallback(() => {
        if (!tests.length) return null;

        return tests.map(test => (
            <Link
                key={test.id}
                to={`/test/${test.id}`} // Изменяем ссылку на /test/{id}
                className="card_link_plan"
            >
                <div className="card_plan">
                    <img
                        src={test.image || '/img/IMG.png'}
                        alt={test.title}
                        className="card_image_plan"
                        onError={(e) => {
                            e.target.src = '/img/IMG.png';
                        }}
                    />
                    <div className="flex_plan">
                        <h2>{test.title}</h2>
                        <p className="duration_plan">
                            ({formatDuration(test.duration_minutes)})
                        </p>
                        <div className="card_tags_plan">
                            {test.categories?.map(category => (
                                <span key={category.id}>{category.name}</span>
                            ))}
                        </div>
                        <p className="description_plan">
                            {test.description || 'Рекомендуем для старта. Получите персональную программу уже сегодня'}
                        </p>
                    </div>
                </div>
            </Link>
        ));
    }, [tests, formatDuration]);

    // Состояние загрузки
    if (loading) {
        return (
            <>
                <Header />
                <main className="test_plan_main">
                    <div className="loading_container_plan">
                        <div className="loading_spinner_plan"></div>
                        <p>Загрузка тестов...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Состояние ошибки
    if (error) {
        return (
            <>
                <Header />
                <main className="test_plan_main">
                    <div className="error_container_plan">
                        <p>Ошибка загрузки: {error}</p>
                        <button onClick={loadTests}>Повторить</button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="test_plan_main">
                <section className="hero_plan">
                    <div className="flex_for_btn_plan">
                        <button className="back_btn_plan" onClick={handleBack}>
                            ←
                        </button>
                        <h1>Составим программу именно под Вас</h1>
                    </div>
                    <p>
                        Всего несколько быстрых тестов помогут подобрать безопасные
                        и эффективные упражнения для Вашего уровня подготовки
                    </p>
                </section>

                <section className="cards_container_plan">
                    {tests.length === 0 ? (
                        <div className="empty_container_plan">
                            <p>Тесты не найдены</p>
                            <button onClick={loadTests}>Обновить</button>
                        </div>
                    ) : (
                        renderTests()
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
};

export default TestPlanPage;