import React from 'react';
import '../../styles/admin/stat_card.scss';

const StatCard = ({ title, value, subtitle, icon, color }) => {
    return (
        <div className="stat-card" style={{ borderTopColor: color }}>
            <div className="stat-card-header">
                <div className="stat-card-icon" style={{ backgroundColor: `${color}15` }}>
                    <img src={icon} alt={title} />
                </div>
                <h3>{title}</h3>
            </div>
            <div className="stat-card-value">{value}</div>
            {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
        </div>
    );
};

export default StatCard;