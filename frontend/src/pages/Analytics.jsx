import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../style/analytics.css';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [analyticsData, setAnalyticsData] = useState({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mock analytics data
  useEffect(() => {
    setAnalyticsData({
      overview: {
        totalRevenue: 125430,
        revenueChange: 12.5,
        totalSales: 1847,
        salesChange: -3.2,
        totalCustomers: 892,
        customersChange: 8.7,
        avgOrderValue: 67.94,
        avgOrderChange: 15.3
      },
      salesData: [
        { date: '2024-06-23', revenue: 18500, sales: 245, customers: 156 },
        { date: '2024-06-24', revenue: 22300, sales: 298, customers: 189 },
        { date: '2024-06-25', revenue: 19800, sales: 267, customers: 171 },
        { date: '2024-06-26', revenue: 25100, sales: 334, customers: 212 },
        { date: '2024-06-27', revenue: 21700, sales: 289, customers: 184 },
        { date: '2024-06-28', revenue: 24900, sales: 321, customers: 203 },
        { date: '2024-06-29', revenue: 26200, sales: 347, customers: 218 }
      ],
      topProducts: [
        { name: 'Smart Thermostat', sales: 145, revenue: 28980, category: 'Climate' },
        { name: 'Security Camera', sales: 98, revenue: 8820, category: 'Security' },
        { name: 'Smart Lock', sales: 76, revenue: 11394, category: 'Security' },
        { name: 'Smart Bulbs', sales: 234, revenue: 7020, category: 'Lighting' },
        { name: 'Motion Sensor', sales: 67, revenue: 4020, category: 'Security' }
      ],
      categoryBreakdown: [
        { category: 'Security', percentage: 35, revenue: 43901 },
        { category: 'Climate', percentage: 28, revenue: 35120 },
        { category: 'Lighting', percentage: 22, revenue: 27595 },
        { category: 'Smart Home', percentage: 15, revenue: 18814 }
      ],
      hourlyData: [
        { hour: '9AM', sales: 12, revenue: 840 },
        { hour: '10AM', sales: 18, revenue: 1260 },
        { hour: '11AM', sales: 25, revenue: 1750 },
        { hour: '12PM', sales: 42, revenue: 2940 },
        { hour: '1PM', sales: 38, revenue: 2660 },
        { hour: '2PM', sales: 35, revenue: 2450 },
        { hour: '3PM', sales: 45, revenue: 3150 },
        { hour: '4PM', sales: 52, revenue: 3640 },
        { hour: '5PM', sales: 48, revenue: 3360 },
        { hour: '6PM', sales: 32, revenue: 2240 }
      ]
    });
  }, [dateRange]);

  const MetricCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '' }) => (
    <div className="metric-card">
      <div className="metric-header">
        <div className="metric-icon">
          <Icon size={24} />
        </div>
        <span className="metric-title">{title}</span>
      </div>
      <div className="metric-value">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
      <div className={`metric-change ${change >= 0 ? 'positive' : 'negative'}`}>
        {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'}</span>
      </div>
    </div>
  );

  const SimpleChart = ({ data, type, height = 200 }) => {
    const maxValue = Math.max(...data.map(d => d.revenue || d.sales || d.value || 0));
    
    return (
      <div className="simple-chart" style={{ height }}>
        <div className="chart-container">
          {type === 'line' && (
            <svg width="100%" height="100%" viewBox="0 0 400 200">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              {data.map((point, index) => {
                const x = (index / (data.length - 1)) * 380 + 10;
                const y = 180 - ((point.revenue || point.sales || point.value || 0) / maxValue) * 160;
                return (
                  <g key={index}>
                    <circle cx={x} cy={y} r="4" fill="#3b82f6" />
                    {index > 0 && (
                      <line
                        x1={(index - 1) / (data.length - 1) * 380 + 10}
                        y1={180 - ((data[index - 1].revenue || data[index - 1].sales || data[index - 1].value || 0) / maxValue) * 160}
                        x2={x}
                        y2={y}
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          )}
          
          {type === 'bar' && (
            <div className="bar-chart">
              {data.map((item, index) => (
                <div key={index} className="bar-item">
                  <div 
                    className="bar"
                    style={{ 
                      height: `${((item.revenue || item.sales || item.value || 0) / maxValue) * 100}%` 
                    }}
                  />
                  <span className="bar-label">{item.hour || item.category || item.name}</span>
                </div>
              ))}
            </div>
          )}
          
          {type === 'pie' && (
            <div className="pie-chart">
              {data.map((item, index) => (
                <div key={index} className="pie-item">
                  <div 
                    className="pie-color" 
                    style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                  />
                  <span className="pie-label">{item.category}</span>
                  <span className="pie-value">{item.percentage}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const exportData = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${dateRange}.json`;
    link.click();
  };

  return (
    <div className="analytics-container">
      <Header notifications={3} />
      <Sidebar collapsed={sidebarCollapsed} toggleCollapse={toggleSidebar} />
      
      <div className={`analytics-page ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="analytics-header">
          <h1>Analytics & Reports</h1>
          <div className="analytics-controls">
            <div className="date-selector">
              <Calendar size={18} />
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
            <button className="export-btn" onClick={exportData}>
              <Download size={18} />
              Export Data
            </button>
          </div>
        </div>

      {/* Key Metrics Overview */}
      <div className="metrics-section">
        <div className="metrics-grid">
          <MetricCard
            title="Total Revenue"
            value={analyticsData.overview?.totalRevenue}
            change={analyticsData.overview?.revenueChange}
            icon={DollarSign}
            prefix="$"
          />
          <MetricCard
            title="Total Sales"
            value={analyticsData.overview?.totalSales}
            change={analyticsData.overview?.salesChange}
            icon={ShoppingCart}
          />
          <MetricCard
            title="Total Customers"
            value={analyticsData.overview?.totalCustomers}
            change={analyticsData.overview?.customersChange}
            icon={Users}
          />
          <MetricCard
            title="Avg Order Value"
            value={analyticsData.overview?.avgOrderValue}
            change={analyticsData.overview?.avgOrderChange}
            icon={TrendingUp}
            prefix="$"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-row">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Revenue Trend</h3>
              <div className="chart-controls">
                <select 
                  value={selectedMetric} 
                  onChange={(e) => setSelectedMetric(e.target.value)}
                >
                  <option value="revenue">Revenue</option>
                  <option value="sales">Sales</option>
                  <option value="customers">Customers</option>
                </select>
              </div>
            </div>
            <SimpleChart 
              data={analyticsData.salesData || []} 
              type="line" 
              height={250}
            />
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Sales by Hour</h3>
            </div>
            <SimpleChart 
              data={analyticsData.hourlyData || []} 
              type="bar" 
              height={250}
            />
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Category Breakdown</h3>
            </div>
            <SimpleChart 
              data={analyticsData.categoryBreakdown || []} 
              type="pie" 
              height={250}
            />
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Top Products</h3>
            </div>
            <div className="top-products-list">
              {analyticsData.topProducts?.map((product, index) => (
                <div key={index} className="product-item">
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-category">{product.category}</div>
                  </div>
                  <div className="product-stats">
                    <div className="product-sales">{product.sales} sold</div>
                    <div className="product-revenue">${product.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="reports-section">
        <h3>Detailed Reports</h3>
        <div className="reports-grid">
          <div className="report-card">
            <div className="report-icon">
              <BarChart3 size={32} />
            </div>
            <div className="report-info">
              <h4>Sales Report</h4>
              <p>Comprehensive sales data with trends and comparisons</p>
              <button className="report-btn">Generate Report</button>
            </div>
          </div>

          <div className="report-card">
            <div className="report-icon">
              <PieChart size={32} />
            </div>
            <div className="report-info">
              <h4>Product Performance</h4>
              <p>Product-wise sales analysis and inventory insights</p>
              <button className="report-btn">Generate Report</button>
            </div>
          </div>

          <div className="report-card">
            <div className="report-icon">
              <Users size={32} />
            </div>
            <div className="report-info">
              <h4>Customer Analytics</h4>
              <p>Customer behavior and purchase pattern analysis</p>
              <button className="report-btn">Generate Report</button>
            </div>
          </div>

          <div className="report-card">
            <div className="report-icon">
              <LineChart size={32} />
            </div>
            <div className="report-info">
              <h4>Financial Summary</h4>
              <p>Revenue, profit margins, and financial trends</p>
              <button className="report-btn">Generate Report</button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="insights-section">
        <h3>Performance Insights</h3>
        <div className="insights-grid">
          <div className="insight-card positive">
            <div className="insight-indicator"></div>
            <div className="insight-content">
              <h4>Revenue Growth</h4>
              <p>Revenue increased by 12.5% compared to last period. Strong performance in Security category.</p>
            </div>
          </div>

          <div className="insight-card warning">
            <div className="insight-indicator"></div>
            <div className="insight-content">
              <h4>Sales Volume</h4>
              <p>Sales volume decreased by 3.2%. Consider promotional campaigns to boost sales.</p>
            </div>
          </div>

          <div className="insight-card positive">
            <div className="insight-indicator"></div>
            <div className="insight-content">
              <h4>Customer Growth</h4>
              <p>Customer base grew by 8.7%. Excellent customer acquisition this period.</p>
            </div>
          </div>

          <div className="insight-card info">
            <div className="insight-indicator"></div>
            <div className="insight-content">
              <h4>Peak Hours</h4>
              <p>Peak sales hours are 3-5 PM. Consider staffing adjustments during these hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Analytics;
