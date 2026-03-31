// src/pages/admin/AdminDashboard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../hooks/admin/useDashboard';
import StatCard from '../../components/admin/StatCard.jsx';
import RevenueChart from '../../components/admin/RevenueChart';
import RecentItems from '../../components/admin/RecentItems';
import '../../styles/admin/admin_dashboard.scss';
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const {
        overview,
        latestTests,
        latestWorkouts,
        loading,
        error,
        chartType,
        selectedYear,
        selectedPeriod,
        getCurrentChartData,
        getChartTitle,
        handleChartTypeChange,
        handleYearChange,
        handlePeriodChange,
        formatCurrency,
        formatDate
    } = useDashboard();

    const handleViewAllTests = () => {
        navigate('/admin/tests');
    };

    const handleViewAllWorkouts = () => {
        navigate('/admin/workouts');
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">Загрузка данных...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    // Доступные годы для выбора (текущий и предыдущий)
    const currentYear = new Date().getFullYear();
    const availableYears = [currentYear, currentYear - 1];

    // Доступные периоды
    const availablePeriods = [1, 3, 6, 12];

    return (
        <>
            <AdminPageHeader
                title="Панель управления"

            />

        <div className="dashboard-container">
            <div className="dashboard_header">
            </div>
            <div className="chart-section">
                <RevenueChart
                    data={getCurrentChartData()}
                    title={getChartTitle()}
                />
                <div className="chart-controls">
                    {chartType !== 'period' ? (
                        <div className="year-selector">
                            <label>Год:</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                            >
                                {availableYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="period-selector">
                            <label>Период (мес):</label>
                            <div className="period-buttons">
                                {availablePeriods.map(period => (
                                    <button
                                        key={period}
                                        className={selectedPeriod === period ? 'active' : ''}
                                        onClick={() => handlePeriodChange(period)}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="chart-type-buttons">
                        <button
                            className={chartType === 'revenue' ? 'active' : ''}
                            onClick={() => handleChartTypeChange('revenue')}
                        >
                            Выручка
                        </button>
                        <button
                            className={chartType === 'count' ? 'active' : ''}
                            onClick={() => handleChartTypeChange('count')}
                        >
                            Количество подписок
                        </button>
                        <button
                            className={chartType === 'period' ? 'active' : ''}
                            onClick={() => handleChartTypeChange('period')}
                        >
                            По периодам
                        </button>
                    </div>
                </div>


            </div>

            <div className="recent-section">
                <RecentItems
                    title="Последние добавленные тесты"
                    items={latestTests}
                    type="test"
                    onViewAll={handleViewAllTests}
                />
                <RecentItems
                    title="Последние добавленные тренировки"
                    items={latestWorkouts}
                    type="workout"
                    onViewAll={handleViewAllWorkouts}
                />
            </div>
        </div>
        </>
    );
};

export default AdminDashboard;