import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ShoppingCart, Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../style/dashboard.css';

// Mock data for demonstration
const mockSalesData = [
  { name: 'Mon', sales: 2400, orders: 24 },
  { name: 'Tue', sales: 1398, orders: 13 },
  { name: 'Wed', sales: 9800, orders: 98 },
  { name: 'Thu', sales: 3908, orders: 39 },
  { name: 'Fri', sales: 4800, orders: 48 },
  { name: 'Sat', sales: 3800, orders: 38 },
  { name: 'Sun', sales: 4300, orders: 43 }
];

const mockTransactions = [
  { id: 'INV-001', customer: 'John Doe', amount: 245.50, date: '2024-06-24', status: 'Completed' },
  { id: 'INV-002', customer: 'Jane Smith', amount: 189.75, date: '2024-06-24', status: 'Pending' },
  { id: 'INV-003', customer: 'Mike Johnson', amount: 567.25, date: '2024-06-23', status: 'Completed' },
  { id: 'INV-004', customer: 'Sarah Wilson', amount: 123.00, date: '2024-06-23', status: 'Completed' },
  { id: 'INV-005', customer: 'Tom Brown', amount: 445.80, date: '2024-06-22', status: 'Refunded' }
];

const lowStockItems = [
  { name: 'iPhone 14 Pro', stock: 3, threshold: 10 },
  { name: 'Samsung Galaxy S23', stock: 2, threshold: 8 },
  { name: 'MacBook Air M2', stock: 1, threshold: 5 },
  { name: 'iPad Pro', stock: 4, threshold: 12 }
];

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const MetricCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className={`metric-card ${color}`}>
      <div className="metric-header">
        <Icon className="metric-icon" />
        <span className="metric-trend">{trend}</span>
      </div>
      <div className="metric-content">
        <h3 className="metric-value">{value}</h3>
        <p className="metric-title">{title}</p>
      </div>
    </div>
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'Pending': return 'status-pending';
      case 'Refunded': return 'status-refunded';
      default: return '';
    }
  };

  return (
    <div className="dashboard-container">
      <Header notifications={notifications} />
      <Sidebar 
        collapsed={sidebarCollapsed} 
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      <div className={`dashboard-page ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening with your store today.
          </p>
          <div className="current-time">
            {currentTime.toLocaleString()}
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="metrics-grid">
          <MetricCard
            title="Total Sales"
            value="$25,450"
            icon={DollarSign}
            color="metric-sales"
            trend="+12.5%"
          />
          <MetricCard
            title="Total Products"
            value="1,247"
            icon={Package}
            color="metric-products"
            trend="+3.2%"
          />
          <MetricCard
            title="Low Stock"
            value="12"
            icon={AlertTriangle}
            color="metric-warning"
            trend="-2"
          />
          <MetricCard
            title="Today's Sales"
            value="$3,200"
            icon={TrendingUp}
            color="metric-today"
            trend="+8.1%"
          />
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <div className="chart-header">
              <h2>Recent Sales</h2>
              <div className="chart-controls">
                <select className="chart-select">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>
              </div>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="low-stock-panel">
            <div className="panel-header">
              <h3>Low Stock Alerts</h3>
              <span className="alert-count">{lowStockItems.length}</span>
            </div>
            <div className="low-stock-list">
              {lowStockItems.map((item, index) => (
                <div key={index} className="low-stock-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="stock-info">
                      {item.stock} left (min: {item.threshold})
                    </span>
                  </div>
                  <div className="urgency-indicator">
                    <div 
                      className="urgency-bar"
                      style={{ 
                        width: `${(item.stock / item.threshold) * 100}%`,
                        backgroundColor: item.stock <= 2 ? '#ef4444' : '#f59e0b'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="transactions-section">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="transactions-table">
            <div className="table-header">
              <div className="th">Invoice</div>
              <div className="th">Customer</div>
              <div className="th">Amount</div>
              <div className="th">Date</div>
              <div className="th">Status</div>
            </div>
            <div className="table-body">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="table-row">
                  <div className="td invoice-id">{transaction.id}</div>
                  <div className="td">{transaction.customer}</div>
                  <div className="td amount">${transaction.amount}</div>
                  <div className="td">{transaction.date}</div>
                  <div className="td">
                    <span className={`status-badge ${getStatusClass(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
    </div>
  );
};

export default Dashboard;