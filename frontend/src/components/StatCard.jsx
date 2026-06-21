import React from 'react';
import './StatCard.css';

function StatCard({ title, value, change, icon, color }) {
  const isPositive = change?.startsWith('+');
  
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}20`, color: color }}>
        {icon}
      </div>
      <div className="stat-info">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
        {change && (
          <p className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
            {change} from last month
          </p>
        )}
      </div>
    </div>
  );
}

export default StatCard;