import React from 'react';
import './TaxContainer.css';

function TaxContainer({ title, children, action }) {
  return (
    <div className="tax-container card">
      <div className="tax-container-header">
        <h3>{title}</h3>
        {action && <div className="tax-container-action">{action}</div>}
      </div>
      <div className="tax-container-body">
        {children}
      </div>
    </div>
  );
}

export default TaxContainer;