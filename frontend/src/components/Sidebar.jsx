import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Package, Users, ShoppingCart, DollarSign, BarChart, BarChart3, ShoppingBag } from 'lucide-react';
import '../style/sidebar.css';

const Sidebar = ({ collapsed, toggleCollapse }) => {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button 
        className="sidebar-toggle"
        onClick={toggleCollapse}
      >
        ☰
      </button>
      
      <nav className="sidebar-nav">
        <Link to="/dashboard" className="sidebar-link">
          <TrendingUp className="sidebar-icon" />
          {!collapsed && <span>Dashboard</span>}
        </Link>
        <Link to="/analytics" className="sidebar-link">
          <BarChart3 className="sidebar-icon" />
          {!collapsed && <span>Analytics</span>}
        </Link>
        <Link to="/orders" className="sidebar-link">
          <ShoppingBag className="sidebar-icon" />
          {!collapsed && <span>Orders</span>}
        </Link>
        <Link to="/stock" className="sidebar-link">
          <Package className="sidebar-icon" />
          {!collapsed && <span>Stock</span>}
        </Link>
        <Link to="/employees" className="sidebar-link">
          <Users className="sidebar-icon" />
          {!collapsed && <span>Employees</span>}
        </Link>
        <Link to="/pos" className="sidebar-link">
          <ShoppingCart className="sidebar-icon" />
          {!collapsed && <span>POS</span>}
        </Link>
        <Link to="/pricing" className="sidebar-link">
          <DollarSign className="sidebar-icon" />
          {!collapsed && <span>Pricing</span>}
        </Link>
        <Link to="/reports" className="sidebar-link">
          <BarChart className="sidebar-icon" />
          {!collapsed && <span>Reports</span>}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;