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
import { productAPI } from '../services/api';
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
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    costPrice: '',
    status: 'active'
  });

  const categories = ['Security', 'Climate', 'Lighting', 'Smart Home', 'Audio', 'Networking'];
  const statuses = ['active', 'inactive', 'out-of-stock'];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: currentPage,
        limit: productsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      };

      const response = await productAPI.getProducts(params);
      
      if (response.success) {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setTotalPages(response.pages);
        setTotalProducts(response.total);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [currentPage, productsPerPage]);

  // Filter and search products (now triggers API call)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, categoryFilter, statusFilter]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        costPrice: parseFloat(newProduct.costPrice),
      };
      
      const response = await productAPI.createProduct(productData);
      
      if (response.success) {
        setShowAddModal(false);
        setNewProduct({
          name: '',
          category: '',
          price: '',
          stock: '',
          description: '',
          supplier: '',
          sku: '',
          costPrice: '',
          status: 'active'
        });
        fetchProducts(); // Refresh the product list
      } else {
        setError(response.message || 'Failed to create product');
      }
    } catch (err) {
      setError(err.message || 'Failed to create product');
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      supplier: product.supplier || '',
      sku: product.sku,
      costPrice: product.costPrice?.toString() || '',
      status: product.status
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        costPrice: parseFloat(newProduct.costPrice),
      };
      
      const response = await productAPI.updateProduct(selectedProduct._id, productData);
      
      if (response.success) {
        setShowEditModal(false);
        setSelectedProduct(null);
        setNewProduct({
          name: '',
          category: '',
          price: '',
          stock: '',
          description: '',
          supplier: '',
          sku: '',
          costPrice: '',
          status: 'active'
        });
        fetchProducts(); // Refresh the product list
      } else {
        setError(response.message || 'Failed to update product');
      }
    } catch (err) {
      setError(err.message || 'Failed to update product');
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      setLoading(true);
      setError(null);
      
      try {
        const response = await productAPI.deleteProduct(product._id);
        
        if (response.success) {
          fetchProducts(); // Refresh the product list
        } else {
          setError(response.message || 'Failed to delete product');
        }
      } catch (err) {
        setError(err.message || 'Failed to delete product');
        console.error('Error deleting product:', err);
      } finally {
        setLoading(false);
      }
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
              <span className="stat-value">{totalProducts}</span>
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
            <button className="btn btn-secondary" onClick={fetchProducts} disabled={loading}>
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Refreshing...' : 'Refresh'}
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

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <AlertTriangle size={18} />
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Products Display */}
        <div className={`products-display ${viewMode}`}>
          {loading ? (
            <div className="loading-spinner">
              <RefreshCw size={48} className="animate-spin" />
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="products-grid">
                  {currentProducts.map(product => (
                    <div key={product._id} className="product-card">
                      {product.featured && <span className="featured-badge">Featured</span>}
                      <div className="product-image">
                        <img src={product.images?.[0]?.url || '/api/placeholder/200/200'} alt={product.name} />
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
                            onClick={() => handleDeleteProduct(product)}
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
                            <span>{product.rating || 0}</span>
                          </div>
                        </div>
                        <div className="product-stats">
                          <div className="stat">
                            <Package size={14} />
                            <span>Stock: {product.stock}</span>
                          </div>
                          <div className="stat">
                            <ShoppingCart size={14} />
                            <span>Sales: {product.sales || 0}</span>
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
                        <tr key={product._id}>
                          <td>
                            <div className="product-cell">
                              <img src={product.images?.[0]?.url || '/api/placeholder/200/200'} alt={product.name} className="product-thumb" />
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
                            <span className="sales-cell">{product.sales || 0}</span>
                          </td>
                          <td>
                            <div className="rating-cell">
                              <Star className="star-icon" />
                              <span>{product.rating || 0}</span>
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
                                onClick={() => handleDeleteProduct(product)}
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

              {filteredProducts.length === 0 && !loading && (
                <div className="no-products">
                  <Package size={48} />
                  <h3>No Products Found</h3>
                  <p>No products match your current search criteria.</p>
                </div>
              )}
            </>
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
                    <label>Cost Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.costPrice}
                      onChange={(e) => setNewProduct({...newProduct, costPrice: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Supplier</label>
                    <input
                      type="text"
                      required
                      value={newProduct.supplier}
                      onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    required
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
                    <label>Cost Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.costPrice}
                      onChange={(e) => setNewProduct({...newProduct, costPrice: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Supplier</label>
                    <input
                      type="text"
                      required
                      value={newProduct.supplier}
                      onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    required
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
