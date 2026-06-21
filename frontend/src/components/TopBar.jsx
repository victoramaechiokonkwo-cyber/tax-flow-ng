import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import './TopBar.css';

function TopBar({ toggleSidebar }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Search transactions, taxpayers..." />
        </div>
      </div>
      <div className="topbar-right">
        <div className="notification">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </div>
        <div className="institution-badge">
          <span>🏛️ Federal Ministry of Finance</span>
        </div>
      </div>
    </header>
  );
}

export default TopBar;