import React from 'react';
import { useTax } from '../context/TaxContext';
import { Shield, Clock, User, Monitor } from 'lucide-react';
import './AuditTrail.css';

function AuditTrail() {
  const { auditLogs } = useTax();

  const getActionIcon = (action) => {
    if (action.includes('Security')) return <Shield size={16} />;
    if (action.includes('Data')) return <Monitor size={16} />;
    if (action.includes('Report')) return <Clock size={16} />;
    return <User size={16} />;
  };

  return (
    <div>
      <div className="page-header">
        <h1>Audit Trail</h1>
        <p>Track all system activities, user actions, and data modifications</p>
      </div>

      <div className="audit-stats grid-4">
        <div className="card audit-stat">
          <p className="audit-label">Total Events</p>
          <h3>14,205</h3>
        </div>
        <div className="card audit-stat">
          <p className="audit-label">Today</p>
          <h3>1,847</h3>
        </div>
        <div className="card audit-stat">
          <p className="audit-label">Security Events</p>
          <h3>23</h3>
        </div>
        <div className="card audit-stat">
          <p className="audit-label">Failed Attempts</p>
          <h3>3</h3>
        </div>
      </div>

      <div className="card" style={{marginTop: '24px'}}>
        <div className="audit-header">
          <h3>Activity Log</h3>
          <div className="audit-filters">
            <select>
              <option>All Events</option>
              <option>Security</option>
              <option>Data Changes</option>
              <option>User Actions</option>
            </select>
            <input type="date" defaultValue="2026-06-21" />
          </div>
        </div>
        <div className="audit-timeline">
          {auditLogs.map((log, index) => (
            <div key={log.id} className="audit-item">
              <div className="audit-marker">
                <div className="audit-dot"></div>
                {index !== auditLogs.length - 1 && <div className="audit-line"></div>}
              </div>
              <div className="audit-content">
                <div className="audit-top">
                  <span className="audit-action">{log.action}</span>
                  <span className="audit-time">{log.timestamp}</span>
                </div>
                <div className="audit-bottom">
                  <span className="audit-user"><User size={14} /> {log.user}</span>
                  <span className="audit-ip"><Monitor size={14} /> {log.ip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuditTrail;