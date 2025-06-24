import React, { useState } from 'react';
import { Package, Upload, Download, AlertTriangle, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import '../style/stockManagement.css';

const StockManagement = () => {
  // Mock data for demonstration
  const [stockItems, setStockItems] = useState([
    { id: 1, name: 'Switch', category: 'Switches', stock: 50, minStock: 10, maxStock: 100, cost: 800, price: 1200, supplier: 'TechCorp' },
    { id: 2, name: 'LED 9W', category: 'Lighting', stock: 100, minStock: 20, maxStock: 200, cost: 500, price: 800, supplier: 'LightTech' },
    { id: 3, name: 'Sensor', category: 'Sensors', stock: 30, minStock: 5, maxStock: 50, cost: 1000, price: 1500, supplier: 'SensorPlus' },
    { id: 4, name: 'Smart Lock', category: 'Security', stock: 15, minStock: 5, maxStock: 30, cost: 3000, price: 4500, supplier: 'SecurityPro' },
    { id: 5, name: 'Motion Detector', category: 'Sensors', stock: 25, minStock: 10, maxStock: 40, cost: 1200, price: 1800, supplier: 'SensorPlus' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStockItem, setNewStockItem] = useState({
    name: '',
    category: '',
    stock: 0,
    minStock: 0,
    maxStock: 0,
    cost: 0,
    price: 0,
    supplier: ''
  });

  // Extract unique categories and suppliers for filters
  const categories = [...new Set(stockItems.map(item => item.category))];
  const suppliers = [...new Set(stockItems.map(item => item.supplier))];

  // Pagination
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter items based on search and dropdown selections
  const filteredItems = stockItems.filter(item => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === '' || item.category === selectedCategory) &&
      (selectedSupplier === '' || item.supplier === selectedSupplier)
    );
  });

  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Handler for adding new stock item
  const handleAddStock = (e) => {
    e.preventDefault();
    setStockItems([
      ...stockItems,
      {
        id: stockItems.length + 1,
        ...newStockItem
      }
    ]);
    setIsAddModalOpen(false);
    setNewStockItem({
      name: '',
      category: '',
      stock: 0,
      minStock: 0,
      maxStock: 0,
      cost: 0,
      price: 0,
      supplier: ''
    });
  };

  // Handler for deleting stock item
  const handleDeleteItem = (id) => {
    setStockItems(stockItems.filter(item => item.id !== id));
  };

  // Handler for importing CSV
  const handleImportCSV = () => {
    // In a real app, this would trigger a file dialog and process the CSV
    alert('CSV Import functionality would be implemented here');
  };

  // Handler for exporting data
  const handleExport = () => {
    // In a real app, this would generate a CSV or Excel file for download
    alert('Export functionality would be implemented here');
  };

  // Handler for showing low stock alerts
  const handleLowStockAlert = () => {
    const lowStockItems = stockItems.filter(item => item.stock <= item.minStock);
    alert(`${lowStockItems.length} items are below minimum stock level!`);
  };

  return (
    <div className="stock-management-container">
      <div className="stock-header">
        <h1>STOCK MANAGEMENT</h1>
        <div className="header-icon">
          <Package size={28} />
        </div>
      </div>

      <div className="action-buttons">
        <button className="action-btn add-btn" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} /> Add Stock
        </button>
        <button className="action-btn import-btn" onClick={handleImportCSV}>
          <Upload size={16} /> Import CSV
        </button>
        <button className="action-btn export-btn" onClick={handleExport}>
          <Download size={16} /> Export
        </button>
        <button className="action-btn alert-btn" onClick={handleLowStockAlert}>
          <AlertTriangle size={16} /> Low Stock Alert
        </button>
      </div>

      <div className="filter-section">
        <div className="search-box">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="search-input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-dropdown">
          <label>Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-dropdown">
          <label>Supplier:</label>
          <select 
            value={selectedSupplier} 
            onChange={(e) => setSelectedSupplier(e.target.value)}
          >
            <option value="">All Suppliers</option>
            {suppliers.map((supplier, index) => (
              <option key={index} value={supplier}>{supplier}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stock-table-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Min</th>
              <th>Max</th>
              <th>Cost</th>
              <th>Price</th>
              <th>Supplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className={item.stock <= item.minStock ? 'low-stock' : ''}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td className="numeric">{item.stock}</td>
                <td className="numeric">{item.minStock}</td>
                <td className="numeric">{item.maxStock}</td>
                <td className="numeric">${item.cost}</td>
                <td className="numeric">${item.price}</td>
                <td>{item.supplier}</td>
                <td className="actions">
                  <button className="icon-btn edit-btn" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button 
                    className="icon-btn delete-btn" 
                    title="Delete"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button 
            key={page} 
            className={currentPage === page ? 'active' : ''}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button 
          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Stock Item</h2>
              <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleAddStock}>
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  required
                  value={newStockItem.name}
                  onChange={(e) => setNewStockItem({...newStockItem, name: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <input 
                    type="text" 
                    required
                    value={newStockItem.category}
                    onChange={(e) => setNewStockItem({...newStockItem, category: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Supplier</label>
                  <input 
                    type="text" 
                    required
                    value={newStockItem.supplier}
                    onChange={(e) => setNewStockItem({...newStockItem, supplier: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={newStockItem.stock}
                    onChange={(e) => setNewStockItem({...newStockItem, stock: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Min Stock</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={newStockItem.minStock}
                    onChange={(e) => setNewStockItem({...newStockItem, minStock: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Max Stock</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={newStockItem.maxStock}
                    onChange={(e) => setNewStockItem({...newStockItem, maxStock: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Cost Price ($)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    value={newStockItem.cost}
                    onChange={(e) => setNewStockItem({...newStockItem, cost: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Selling Price ($)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    value={newStockItem.price}
                    onChange={(e) => setNewStockItem({...newStockItem, price: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;