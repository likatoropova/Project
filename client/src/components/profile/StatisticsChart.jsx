// src/components/profile/StatisticsChart.jsx

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import '../../styles/statistics_chart.scss';

const StatisticsChart = ({ type, data }) => {
    if (!data) {
        return (
            <div className="chart-container">
                <div className="chart-empty">
                    <p>Нет данных для отображения</p>
                </div>
            </div>
        );
    }

    const renderChart = () => {
        switch (type) {
            case 'volume':
                return (
                    <div className="chart-wrapper">
                        <div className="chart-header">
                            <h3>Статистика тренировок пользователя</h3>
                            <div className="chart-info">
                                <span>{data.period?.label || ''}</span>
                                {data.average_score_label && (
                                    <span className="average-score">
                    Средняя оценка: {data.average_score_label} ({data.average_score_percent}%)
                  </span>
                                )}
                            </div>
                        </div>

                        {data.chart && data.chart.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data.chart}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="total_volume"
                                        fill="#d8eded"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="chart-empty">Нет данных за выбранный период</div>
                        )}
                    </div>
                );

            case 'frequency':
                return (
                    <div className="chart-wrapper">
                        <div className="chart-header">
                            <h3>Частота тренировок</h3>
                            <span className="period-label">{data.period_info?.label || ''}</span>
                        </div>

                        {data.chart && data.chart.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data.chart}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="short_label" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="count"
                                        fill="#d8eded"
                                        radius={[8, 8, 0, 0]}
                                        name="Тренировок"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="chart-empty">Нет данных за выбранный период</div>
                        )}

                    </div>
                );

            case 'trend':
                return (
                    <div className="chart-wrapper">
                        <div className="chart-header">
                            <h3>{data.workout?.title || 'Тренды'}</h3>
                            <span className="workout-date">{data.workout?.completed_at_formatted || ''}</span>
                        </div>

                        {data.chart && data.chart.length > 0 ? (
                            <div className="trend-list">
                                {data.chart.map((exercise, index) => (
                                    <div key={index} className="trend-item">
                                        <div className="trend-exercise-info">
                                            <h4>{exercise.exercise_name}</h4>
                                            <p className="exercise-details">
                                                {exercise.sets_completed} подхода × {exercise.reps_completed} повт.
                                                {exercise.weight_used && ` • ${exercise.weight_used} кг`}
                                            </p>
                                        </div>
                                        <div className="trend-score">
                                            <div className={`score-badge ${exercise.reaction}`}>
                                                {exercise.score}%
                                            </div>
                                            <span className="score-label">{exercise.score_label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="chart-empty">Нет данных для отображения</div>
                        )}
                    </div>
                );

            default:
                return <div className="chart-empty">Выберите тип статистики</div>;
        }
    };

    return (
        <div className="statistics-chart">
            {renderChart()}
        </div>
    );
};

export default StatisticsChart;