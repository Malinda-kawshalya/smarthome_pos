import React from 'react';
import { Package, Bell, Search, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../style/header.css';

const Header = ({ notifications = 0 }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <Package className="logo-icon" />
          <span className="logo-text">SmartHome.lk</span>
        </div>
      </div>
      
      <nav className="main-nav">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/analytics" className="nav-link">Analytics</Link>
        <Link to="/orders" className="nav-link">Orders</Link>
        <Link to="/products" className="nav-link">Products</Link>
      </nav>

      <div className="header-right">
        <div className="search-box">
          <Search className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
        


        <div className="user-profile">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Administrator</span>
          </div>
          <button className="icon-btn logout-btn">
            <LogOut />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;