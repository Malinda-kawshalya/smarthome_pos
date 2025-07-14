import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ShoppingCart, Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../style/dashboard.css';
import { productAPI } from '../services/api';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(5);
  const [salesData, setSalesData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalProducts: 0,
    lowStockCount: 0,
    todaySales: 0,
    salesTrend: '0%',
    productsTrend: '0%',
    lowStockTrend: '0',
    todaySalesTrend: '0%'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch sales data for chart
        const salesResponse = await fetch('http://localhost:5000/api/analytics/sales');
        const salesData = await salesResponse.json();
        setSalesData(salesData);
        
        // Fetch recent transactions
        const transactionsResponse = await fetch('http://localhost:5000/api/transactions/recent');
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData);
        
        // Fetch low stock items
        const lowStockResponse = await productAPI.getLowStockProducts();
        setLowStockItems(lowStockResponse);
        
        // Fetch dashboard metrics
        const metricsResponse = await fetch('http://localhost:5000/api/analytics/metrics');
        const metricsData = await metricsResponse.json();
        setMetrics({
          totalSales: metricsData.totalSales || 0,
          totalProducts: metricsData.totalProducts || 0,
          lowStockCount: metricsData.lowStockCount || 0,
          todaySales: metricsData.todaySales || 0,
          salesTrend: metricsData.salesTrend || '0%',
          productsTrend: metricsData.productsTrend || '0%',
          lowStockTrend: metricsData.lowStockTrend || '0',
          todaySalesTrend: metricsData.todaySalesTrend || '0%'
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
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

  if (isLoading) {
    return <div className="loading-container">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

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
            value={`$${metrics.totalSales.toLocaleString()}`}
            icon={DollarSign}
            color="metric-sales"
            trend={metrics.salesTrend}
          />
          <MetricCard
            title="Total Products"
            value={metrics.totalProducts.toLocaleString()}
            icon={Package}
            color="metric-products"
            trend={metrics.productsTrend}
          />
          <MetricCard
            title="Low Stock"
            value={metrics.lowStockCount}
            icon={AlertTriangle}
            color="metric-warning"
            trend={metrics.lowStockTrend}
          />
          <MetricCard
            title="Today's Sales"
            value={`$${metrics.todaySales.toLocaleString()}`}
            icon={TrendingUp}
            color="metric-today"
            trend={metrics.todaySalesTrend}
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
                <LineChart data={salesData}>
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
              {transactions.map((transaction) => (
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