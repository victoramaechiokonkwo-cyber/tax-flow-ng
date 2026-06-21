import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calculator,
  Layers,
  Database,
  FileText,
  History,
  Settings,
  LogOut,
  Receipt
} from 'lucide-react';
import './Sidebar.css';

function Sidebar({ isOpen }) {
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/tax-calculator', icon: <Calculator size={20} />, label: 'Tax Calculator' },
    { path: '/tax-modules', icon: <Layers size={20} />, label: 'Tax Modules' },
    { path: '/transactions', icon: <Receipt size={20} />, label: 'Transactions' },
    { path: '/data-extraction', icon: <Database size={20} />, label: 'Data Extraction' },
    { path: '/reports', icon: <FileText size={20} />, label: 'Reports' },
    { path: '/audit-trail', icon: <History size={20} />, label: 'Audit Trail' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">₦</div>
          <div className="logo-text">
            <h3>Tax-Flow NG</h3>
            <span>FIRS Integrated</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.charAt(0) || 'A'}</div>
          <div className="user-details">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;