import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, TrendingUp, Settings, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import '../style/adminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data initialization
  useEffect(() => {
    setUsers([
      { id: 1, name: 'John Doe', email: 'john@smartpos.com', role: 'admin', status: 'active', createdAt: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@smartpos.com', role: 'manager', status: 'active', createdAt: '2024-02-20' },
      { id: 3, name: 'Bob Wilson', email: 'bob@smartpos.com', role: 'cashier', status: 'inactive', createdAt: '2024-03-10' },
    ]);

    setProducts([
      { id: 1, name: 'Smart Thermostat', category: 'Climate Control', price: 199.99, stock: 25, sku: 'STC001', status: 'active' },
      { id: 2, name: 'Security Camera', category: 'Security', price: 89.99, stock: 15, sku: 'SEC002', status: 'active' },
      { id: 3, name: 'Smart Lock', category: 'Security', price: 149.99, stock: 8, sku: 'SLK003', status: 'low-stock' },
    ]);
  }, []);

  const dashboardStats = {
    totalUsers: users.length,
    totalProducts: products.length,
    totalSales: 12450,
    totalRevenue: 89750
  };

  const UserModal = () => {
    const [formData, setFormData] = useState(editingUser || {
      name: '', email: '', role: 'cashier', status: 'active'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (editingUser) {
        setUsers(users.map(user => user.id === editingUser.id ? { ...formData, id: editingUser.id } : user));
      } else {
        setUsers([...users, { ...formData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]);
      }
      setShowUserModal(false);
      setEditingUser(null);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="cashier">Cashier</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => {setShowUserModal(false); setEditingUser(null);}} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingUser ? 'Update' : 'Create'} User
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ProductModal = () => {
    const [formData, setFormData] = useState(editingProduct || {
      name: '', category: '', price: '', stock: '', sku: '', status: 'active'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (editingProduct) {
        setProducts(products.map(product => product.id === editingProduct.id ? { ...formData, id: editingProduct.id } : product));
      } else {
        setProducts([...products, { ...formData, id: Date.now(), price: parseFloat(formData.price), stock: parseInt(formData.stock) }]);
      }
      setShowProductModal(false);
      setEditingProduct(null);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="low-stock">Low Stock</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => {setShowProductModal(false); setEditingProduct(null);}} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingProduct ? 'Update' : 'Create'} Product
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, Admin</span>
          <div className="avatar">A</div>
        </div>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={20} />
          Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} />
          Users
        </button>
        <button 
          className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={20} />
          Products
        </button>
        <button 
          className={`nav-btn ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          <ShoppingCart size={20} />
          Sales
        </button>
        <button 
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} />
          Settings
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon users">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h3>{dashboardStats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon products">
                  <Package size={24} />
                </div>
                <div className="stat-info">
                  <h3>{dashboardStats.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon sales">
                  <ShoppingCart size={24} />
                </div>
                <div className="stat-info">
                  <h3>{dashboardStats.totalSales}</h3>
                  <p>Total Sales</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon revenue">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-info">
                  <h3>${dashboardStats.totalRevenue.toLocaleString()}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">👤</span>
                  <span>New user registered: jane@smartpos.com</span>
                  <span className="activity-time">2 hours ago</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">📦</span>
                  <span>Product updated: Smart Thermostat</span>
                  <span className="activity-time">4 hours ago</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">💰</span>
                  <span>Sale completed: $149.99</span>
                  <span className="activity-time">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h2>User Management</h2>
              <div className="section-actions">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="btn-primary" onClick={() => setShowUserModal(true)}>
                  <Plus size={18} />
                  Add User
                </button>
              </div>
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.createdAt}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-edit"
                            onClick={() => {setEditingUser(user); setShowUserModal(true);}}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => setUsers(users.filter(u => u.id !== user.id))}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h2>Product Management</h2>
              <div className="section-actions">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="btn-primary" onClick={() => setShowProductModal(true)}>
                  <Plus size={18} />
                  Add Product
                </button>
              </div>
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>SKU</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.sku}</td>
                      <td>
                        <span className={`status-badge ${product.status}`}>
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-edit"
                            onClick={() => {setEditingProduct(product); setShowProductModal(true);}}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => setProducts(products.filter(p => p.id !== product.id))}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="sales-section">
            <div className="analytics-preview">
              <h2>Sales Analytics</h2>
              <div className="quick-stats">
                <div className="quick-stat">
                  <h4>Today's Sales</h4>
                  <p className="stat-value">$2,347</p>
                  <span className="stat-change positive">+8.2%</span>
                </div>
                <div className="quick-stat">
                  <h4>This Week</h4>
                  <p className="stat-value">$15,890</p>
                  <span className="stat-change positive">+12.5%</span>
                </div>
                <div className="quick-stat">
                  <h4>This Month</h4>
                  <p className="stat-value">$67,234</p>
                  <span className="stat-change negative">-3.1%</span>
                </div>
                <div className="quick-stat">
                  <h4>Avg Order</h4>
                  <p className="stat-value">$67.94</p>
                  <span className="stat-change positive">+15.3%</span>
                </div>
              </div>
              
              <div className="recent-transactions">
                <h3>Recent Transactions</h3>
                <div className="transaction-list">
                  <div className="transaction-item">
                    <div className="transaction-info">
                      <span className="transaction-id">#TXN-2024-0156</span>
                      <span className="transaction-time">2 minutes ago</span>
                    </div>
                    <div className="transaction-amount">$149.99</div>
                    <div className="transaction-status completed">Completed</div>
                  </div>
                  <div className="transaction-item">
                    <div className="transaction-info">
                      <span className="transaction-id">#TXN-2024-0155</span>
                      <span className="transaction-time">5 minutes ago</span>
                    </div>
                    <div className="transaction-amount">$89.99</div>
                    <div className="transaction-status completed">Completed</div>
                  </div>
                  <div className="transaction-item">
                    <div className="transaction-info">
                      <span className="transaction-id">#TXN-2024-0154</span>
                      <span className="transaction-time">8 minutes ago</span>
                    </div>
                    <div className="transaction-amount">$234.50</div>
                    <div className="transaction-status pending">Pending</div>
                  </div>
                  <div className="transaction-item">
                    <div className="transaction-info">
                      <span className="transaction-id">#TXN-2024-0153</span>
                      <span className="transaction-time">12 minutes ago</span>
                    </div>
                    <div className="transaction-amount">$67.25</div>
                    <div className="transaction-status completed">Completed</div>
                  </div>
                </div>
              </div>

              <div className="analytics-actions">
                <button className="analytics-btn primary">
                  <TrendingUp size={18} />
                  View Full Analytics
                </button>
                <button className="analytics-btn secondary">
                  Generate Sales Report
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2>System Settings</h2>
            <p>System configuration options will be implemented here.</p>
          </div>
        )}
      </div>

      {showUserModal && <UserModal />}
      {showProductModal && <ProductModal />}
    </div>
  );
};

export default AdminDashboard;
