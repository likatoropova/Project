// src/components/admin/RevenueChart.jsx

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import '../../styles/admin/revenue_chart.scss';

const RevenueChart = ({ data, title }) => {
    // Проверяем, что data является массивом
    const chartData = Array.isArray(data) ? data : [];

    if (!chartData || chartData.length === 0) {
        return (
            <div className="chart-container">
                <h3>{title}</h3>
                <div className="chart-empty">Нет данных для отображения</div>
            </div>
        );
    }

    // Форматирование подписей для оси X - получаем правильное поле
    const formatXAxis = (value) => {
        // value - это уже значение поля month_name (строка)
        // Если вдруг undefined, пробуем другие варианты
        if (!value || value === 'undefined') {
            return '';
        }
        return value;
    };

    // Кастомный тултип
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const monthName = data.month_name || data.label || data.month || label;
            const value = payload[0].value;

            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{monthName}</p>
                    <p className="tooltip-value">
                        Значение: {value}
                    </p>
                </div>
            );
        }
        return null;
    };

    const getXAxisDataKey = () => {
        if (chartData.length > 0) {
            const firstItem = chartData[0];
            if (firstItem.month_name !== undefined) return 'month_name';
            if (firstItem.label !== undefined) return 'label';
            if (firstItem.month !== undefined) return 'month';
        }
        return 'month_name'; // значение по умолчанию
    };

    const xAxisDataKey = getXAxisDataKey();

    return (
        <div className="chart-container">
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey={xAxisDataKey}
                        tickFormatter={formatXAxis}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="value"
                        fill="rgba(216, 237, 237, 1)"
                        name="Значение"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueChart;