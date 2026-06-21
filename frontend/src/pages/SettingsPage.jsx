import React, { useState } from 'react';
import { Save, Bell, Lock, Database, User } from 'lucide-react';
import './SettingsPage.css';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'system', label: 'System', icon: <Database size={18} /> },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure system preferences, security, and integration parameters</p>
      </div>

      <div className="settings-layout">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content card">
          {activeTab === 'profile' && (
            <div className="settings-panel">
              <h3>User Profile</h3>
              <div className="avatar-section">
                <div className="profile-avatar">A</div>
                <button className="btn btn-secondary btn-sm">Change Avatar</button>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input defaultValue="Admin User" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input defaultValue="admin@firs.gov.ng" />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input defaultValue="Tax Officer" disabled />
                </div>
                <div className="form-group">
                  <label>Institution</label>
                  <input defaultValue="Federal Ministry of Finance" disabled />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-panel">
              <h3>Security Settings</h3>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" placeholder="Enter current password" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="Enter new password" />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" />
              </div>
              <div className="security-options">
                <label className="toggle-label">
                  <input type="checkbox" defaultChecked />
                  <span>Enable two-factor authentication</span>
                </label>
                <label className="toggle-label">
                  <input type="checkbox" defaultChecked />
                  <span>Require password on every tax filing</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-panel">
              <h3>Notification Preferences</h3>
              <div className="notification-options">
                <label className="toggle-label">
                  <input type="checkbox" defaultChecked />
                  <span>Email alerts for overdue filings</span>
                </label>
                <label className="toggle-label">
                  <input type="checkbox" defaultChecked />
                  <span>SMS alerts for large transactions (&gt;₦10M)</span>
                </label>
                <label className="toggle-label">
                  <input type="checkbox" />
                  <span>Daily summary report</span>
                </label>
                <label className="toggle-label">
                  <input type="checkbox" defaultChecked />
                  <span>System maintenance notifications</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="settings-panel">
              <h3>System Configuration</h3>
              <div className="form-group">
                <label>Legacy Database Connection String</label>
                <input defaultValue="oracle://legacy_db:1521/FINDB" />
              </div>
              <div className="form-group">
                <label>FIRS API Endpoint</label>
                <input defaultValue="https://api.firs.gov.ng/v2/" />
              </div>
              <div className="form-group">
                <label>Data Retention Period (days)</label>
                <input type="number" defaultValue="2555" />
              </div>
              <div className="form-group">
                <label>Backup Schedule</label>
                <select defaultValue="daily">
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          )}

          <div className="settings-footer">
            {saved && <span className="save-confirm">✓ Settings saved successfully</span>}
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;