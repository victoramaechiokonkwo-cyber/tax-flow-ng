import React from 'react';
import './TaxDistribution.css';

function TaxDistribution() {
  const data = [
    { label: 'VAT', value: 35, color: '#1a5f2a' },
    { label: 'PAYE', value: 28, color: '#d4af37' },
    { label: 'CIT', value: 22, color: '#2c3e50' },
    { label: 'WHT', value: 15, color: '#e67e22' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  return (
    <div className="tax-distribution card">
      <h3>Tax Distribution</h3>
      <div className="donut-chart">
        <svg viewBox="0 0 100 100" className="donut">
          {data.map((item, index) => {
            const startPercent = cumulativePercent;
            cumulativePercent += item.value;
            const startAngle = (startPercent / total) * 360;
            const endAngle = (cumulativePercent / total) * 360;
            
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;
            
            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);
            
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            
            const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
            
            return <path key={index} d={path} fill={item.color} />;
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
          <text x="50" y="48" textAnchor="middle" className="donut-label">Total</text>
          <text x="50" y="58" textAnchor="middle" className="donut-value">₦2.1B</text>
        </svg>
      </div>
      <div className="distribution-legend">
        {data.map((item, index) => (
          <div key={index} className="dist-item">
            <span className="dist-color" style={{ background: item.color }}></span>
            <span className="dist-label">{item.label}</span>
            <span className="dist-value">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaxDistribution;