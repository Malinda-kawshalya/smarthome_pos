import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Star,
  TrendingUp,
  TrendingDown,
  Grid,
  List,
  RefreshCw,
  ShoppingCart,
  Layers,
  Tag
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../style/products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    supplier: '',
    sku: '',
    status: 'active'
  });

  const categories = ['Security', 'Climate', 'Lighting', 'Smart Home', 'Audio', 'Networking'];
  const statuses = ['active', 'inactive', 'out-of-stock'];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mock products data
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'Smart Thermostat Pro',
        category: 'Climate',
        price: 199.99,
        stock: 45,
        status: 'active',
        rating: 4.8,
        sales: 156,
        image: '/api/placeholder/200/200',
        sku: 'STP-001',
        supplier: 'TechHome Inc.',
        description: 'Advanced smart thermostat with AI learning capabilities and energy saving features.',
        featured: true
      },
      {
        id: 2,
        name: 'Security Camera 4K',
        category: 'Security',
        price: 89.99,
        stock: 23,
        status: 'active',
        rating: 4.6,
        sales: 203,
        image: '/api/placeholder/200/200',
        sku: 'SC4K-002',
        supplier: 'SecureVision Ltd.',
        description: '4K resolution security camera with night vision and motion detection.',
        featured: false
      },
      {
        id: 3,
        name: 'Smart Lock Elite',
        category: 'Security',
        price: 149.99,
        stock: 12,
        status: 'active',
        rating: 4.9,
        sales: 98,
        image: '/api/placeholder/200/200',
        sku: 'SLE-003',
        supplier: 'LockTech Pro',
        description: 'Premium smart lock with fingerprint and facial recognition technology.',
        featured: true
      },
      {
        id: 4,
        name: 'LED Smart Bulbs (4-pack)',
        category: 'Lighting',
        price: 29.99,
        stock: 0,
        status: 'out-of-stock',
        rating: 4.4,
        sales: 342,
        image: '/api/placeholder/200/200',
        sku: 'LSB-004',
        supplier: 'BrightLight Solutions',
        description: 'Color-changing LED smart bulbs with voice control and app integration.',
        featured: false
      },
      {
        id: 5,
        name: 'Motion Sensor Advanced',
        category: 'Security',
        price: 39.99,
        stock: 67,
        status: 'active',
        rating: 4.3,
        sales: 178,
        image: '/api/placeholder/200/200',
        sku: 'MSA-005',
        supplier: 'SensorTech Corp',
        description: 'Advanced motion sensor with pet immunity and wireless connectivity.',
        featured: false
      },
      {
        id: 6,
        name: 'Smart Speaker Hub',
        category: 'Audio',
        price: 79.99,
        stock: 34,
        status: 'active',
        rating: 4.7,
        sales: 145,
        image: '/api/placeholder/200/200',
        sku: 'SSH-006',
        supplier: 'AudioSmart Inc.',
        description: 'Voice-controlled smart speaker with built-in home automation hub.',
        featured: true
      },
      {
        id: 7,
        name: 'Smart Doorbell Pro',
        category: 'Security',
        price: 159.99,
        stock: 18,
        status: 'active',
        rating: 4.5,
        sales: 87,
        image: '/api/placeholder/200/200',
        sku: 'SDP-007',
        supplier: 'DoorTech Solutions',
        description: 'Premium video doorbell with two-way audio and cloud storage.',
        featured: false
      },
      {
        id: 8,
        name: 'WiFi Router Mesh',
        category: 'Networking',
        price: 249.99,
        stock: 28,
        status: 'active',
        rating: 4.6,
        sales: 76,
        image: '/api/placeholder/200/200',
        sku: 'WRM-008',
        supplier: 'NetConnect Pro',
        description: 'High-speed mesh router system for whole-home coverage.',
        featured: false
      }
    ];
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Filter and search products
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return b.stock - a.stock;
        case 'sales':
          return b.sales - a.sales;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter, sortBy, products]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = {
      id: products.length + 1,
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      rating: 0,
      sales: 0,
      image: '/api/placeholder/200/200',
      featured: false
    };
    setProducts([...products, product]);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      supplier: '',
      sku: '',
      status: 'active'
    });
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setNewProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    setProducts(products.map(p => 
      p.id === selectedProduct.id ? { ...p, ...newProduct } : p
    ));
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="status-icon active" />;
      case 'inactive': return <AlertTriangle className="status-icon inactive" />;
      case 'out-of-stock': return <Trash2 className="status-icon out-of-stock" />;
      default: return <CheckCircle className="status-icon" />;
    }
  };

  const getStatusClass = (status) => {
    return `status-badge ${status}`;
  };

  const exportProducts = () => {
    const dataStr = JSON.stringify(filteredProducts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="products-container">
      <Header notifications={5} />
      <Sidebar collapsed={sidebarCollapsed} toggleCollapse={toggleSidebar} />
      
      <div className={`products-page ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Page Header */}
        <div className="products-header">
          <div className="header-left">
            <h1>Product Management</h1>
            <p>Manage your product inventory and pricing</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{products.length}</span>
              <span className="stat-label">Total Products</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{products.filter(p => p.status === 'active').length}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{products.filter(p => p.stock <= 20).length}</span>
              <span className="stat-label">Low Stock</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="action-bar">
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={18} />
              Add Product
            </button>
            <button className="btn btn-secondary" onClick={exportProducts}>
              <Download size={18} />
              Export
            </button>
            <button className="btn btn-secondary">
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
          
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="products-controls">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search products by name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filters">
            <div className="filter-group">
              <label>Category:</label>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="stock">Stock</option>
                <option value="sales">Sales</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Display */}
        <div className={`products-display ${viewMode}`}>
          {viewMode === 'grid' ? (
            <div className="products-grid">
              {currentProducts.map(product => (
                <div key={product.id} className="product-card">
                  {product.featured && <span className="featured-badge">Featured</span>}
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    <div className="product-overlay">
                      <button 
                        className="overlay-btn"
                        onClick={() => handleEditProduct(product)}
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="overlay-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="product-info">
                    <div className="product-header">
                      <h3 className="product-name">{product.name}</h3>
                      <div className={getStatusClass(product.status)}>
                        {getStatusIcon(product.status)}
                      </div>
                    </div>
                    <div className="product-category">{product.category}</div>
                    <div className="product-details">
                      <div className="product-price">${product.price}</div>
                      <div className="product-rating">
                        <Star className="star-icon" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                    <div className="product-stats">
                      <div className="stat">
                        <Package size={14} />
                        <span>Stock: {product.stock}</span>
                      </div>
                      <div className="stat">
                        <ShoppingCart size={14} />
                        <span>Sales: {product.sales}</span>
                      </div>
                    </div>
                    <div className="product-sku">SKU: {product.sku}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-list">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Sales</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-cell">
                          <img src={product.image} alt={product.name} className="product-thumb" />
                          <div className="product-info-cell">
                            <div className="product-name-cell">{product.name}</div>
                            <div className="product-sku-cell">SKU: {product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{product.category}</span>
                      </td>
                      <td>
                        <span className="price-cell">${product.price}</span>
                      </td>
                      <td>
                        <span className={`stock-cell ${product.stock <= 20 ? 'low' : ''}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <span className="sales-cell">{product.sales}</span>
                      </td>
                      <td>
                        <div className="rating-cell">
                          <Star className="star-icon" />
                          <span>{product.rating}</span>
                        </div>
                      </td>
                      <td>
                        <div className={getStatusClass(product.status)}>
                          {getStatusIcon(product.status)}
                          <span>{product.status.replace('-', ' ')}</span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons-row">
                          <button 
                            className="btn btn-icon btn-edit"
                            onClick={() => handleEditProduct(product)}
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn btn-icon btn-delete"
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Delete Product"
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
          )}

          {filteredProducts.length === 0 && (
            <div className="no-products">
              <Package size={48} />
              <h3>No Products Found</h3>
              <p>No products match your current search criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              className="pagination-btn"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Product</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleAddProduct} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>SKU</label>
                    <input
                      type="text"
                      required
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      required
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={newProduct.status}
                      onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Supplier</label>
                  <input
                    type="text"
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Product</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowEditModal(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleUpdateProduct} className="modal-form">
                {/* Same form fields as add modal */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>SKU</label>
                    <input
                      type="text"
                      required
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      required
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={newProduct.status}
                      onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Supplier</label>
                  <input
                    type="text"
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
