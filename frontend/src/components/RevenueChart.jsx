import React from 'react';
import './RevenueChart.css';

function RevenueChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const data = [45, 52, 48, 61, 55, 67];
  const max = Math.max(...data);

  return (
    <div className="revenue-chart card">
      <div className="chart-header">
        <h3>Revenue Collection Trend</h3>
        <select className="chart-filter">
          <option>Last 6 Months</option>
          <option>Last Year</option>
          <option>Year to Date</option>
        </select>
      </div>
      <div className="chart-bars">
        {data.map((value, index) => (
          <div key={index} className="bar-group">
            <div className="bar-wrapper">
              <div 
                className="bar" 
                style={{ height: `${(value / max) * 100}%` }}
              >
                <span className="bar-value">₦{value}M</span>
              </div>
            </div>
            <span className="bar-label">{months[index]}</span>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: 'var(--primary)' }}></span>
          <span>Actual Collection</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: 'var(--secondary)' }}></span>
          <span>Projected Target</span>
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;