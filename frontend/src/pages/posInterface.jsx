import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, X, Plus, Minus, CreditCard, DollarSign, Printer, Save, BarChart4, Tag, FileText } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../style/pos.css';

// Mock data for demonstration
const mockProducts = [
  { id: 1, name: 'iPhone 14 Pro', price: 999.99, image: '/images/iphone.jpg', category: 'Phones', barcode: '123456789012' },
  { id: 2, name: 'Samsung Galaxy S23', price: 849.50, image: '/images/samsung.jpg', category: 'Phones', barcode: '234567890123' },
  { id: 3, name: 'MacBook Air M2', price: 1199.00, image: '/images/macbook.jpg', category: 'Laptops', barcode: '345678901234' },
  { id: 4, name: 'iPad Pro', price: 799.00, image: '/images/ipad.jpg', category: 'Tablets', barcode: '456789012345' },
  { id: 5, name: 'AirPods Pro', price: 249.00, image: '/images/airpods.jpg', category: 'Audio', barcode: '567890123456' },
  { id: 6, name: 'Apple Watch Series 8', price: 399.00, image: '/images/applewatch.jpg', category: 'Wearables', barcode: '678901234567' },
  { id: 7, name: 'Sony PlayStation 5', price: 499.99, image: '/images/ps5.jpg', category: 'Gaming', barcode: '789012345678' },
  { id: 8, name: 'Dell XPS 13', price: 1299.00, image: '/images/dellxps.jpg', category: 'Laptops', barcode: '890123456789' },
  { id: 9, name: 'Sony WH-1000XM5', price: 349.99, image: '/images/sonywh.jpg', category: 'Audio', barcode: '901234567890' },
  { id: 10, name: 'Google Pixel 7', price: 599.00, image: '/images/pixel.jpg', category: 'Phones', barcode: '012345678901' },
  { id: 11, name: 'Amazon Echo', price: 99.99, image: '/images/echo.jpg', category: 'Smart Home', barcode: '123456789023' },
  { id: 12, name: 'Samsung QLED TV', price: 1299.00, image: '/images/samsungtv.jpg', category: 'TVs', barcode: '234567890234' },
];

const mockCustomers = [
  { id: 1, name: 'Guest Customer', email: '', phone: '' },
  { id: 2, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901' },
];

const categories = ['All', 'Phones', 'Laptops', 'Tablets', 'Audio', 'Wearables', 'Gaming', 'Smart Home', 'TVs'];

const POS = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(mockCustomers[0]);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Filter products based on search and category
  useEffect(() => {
    let filtered = mockProducts;
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory]);

  // Calculate cart totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.10; // 10% tax
  const total = subtotal + tax;

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Handle barcode scanning/input
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const product = mockProducts.find(p => p.barcode === barcodeInput);
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      alert('Product not found');
    }
  };

  // Update cart item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Process payment
  const processPayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount) < total) {
      alert('Please enter a valid payment amount');
      return;
    }

    const change = parseFloat(paymentAmount) - total;
    alert(`Payment successful!\nChange: $${change.toFixed(2)}`);
    
    // In a real app, you'd:
    // 1. Send transaction to backend
    // 2. Generate receipt
    // 3. Print receipt or email to customer
    
    // Reset for next sale
    setCart([]);
    setSelectedCustomer(mockCustomers[0]);
    setPaymentAmount('');
    setShowPaymentModal(false);
  };

  return (
    <div className="pos-container">
      <Header notifications={notifications} />

      <div className="main-content">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />

        <main className="pos-main">
          <div className="pos-layout">
            {/* Left side - Products */}
            <div className="pos-products-section">
              <div className="pos-header">
                <h1>Point of Sale</h1>
                <form className="barcode-form" onSubmit={handleBarcodeSubmit}>
                  <input 
                    type="text" 
                    className="barcode-input" 
                    placeholder="Scan barcode..." 
                    value={barcodeInput} 
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="barcode-submit">Add</button>
                </form>
              </div>
              
              <div className="pos-actions">
                <div className="search-container">
                  <Search className="search-icon" size={18} />
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="categories-container">
                <div className="categories">
                  {categories.map(category => (
                    <button 
                      key={category} 
                      className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-card" onClick={() => addToCart(product)}>
                    <div className="product-image">
                      <img src={product.image || 'https://via.placeholder.com/80'} alt={product.name} />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <span className="product-price">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                
                {filteredProducts.length === 0 && (
                  <div className="no-products">
                    <p>No products found</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right side - Cart */}
            <div className="pos-cart-section">
              <div className="cart-header">
                <div className="customer-info" onClick={() => setShowCustomerModal(true)}>
                  <User size={18} />
                  <span>{selectedCustomer.name}</span>
                </div>
                <button className="clear-cart-btn" onClick={clearCart} disabled={cart.length === 0}>
                  <X size={16} />
                  Clear
                </button>
              </div>
              
              <div className="cart-items-container">
                {cart.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingCart size={48} />
                    <p>Cart is empty</p>
                    <span>Add products by clicking on them</span>
                  </div>
                ) : (
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <span className="item-price">${item.price.toFixed(2)}</span>
                        </div>
                        <div className="item-actions">
                          <div className="quantity-control">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                              <Minus size={16} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <Plus size={16} />
                            </button>
                          </div>
                          <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
                          <button className="remove-item" onClick={() => removeFromCart(item.id)}>
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="cart-totals">
                <div className="totals-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="totals-row">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="totals-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="cart-actions">
                <button className="checkout-btn" disabled={cart.length === 0} onClick={() => setShowPaymentModal(true)}>
                  <CreditCard size={18} />
                  Checkout
                </button>
                <div className="secondary-actions">
                  <button className="action-btn hold-btn" disabled={cart.length === 0}>
                    <Save size={18} />
                    Hold
                  </button>
                  <button className="action-btn discount-btn" disabled={cart.length === 0}>
                    <Tag size={18} />
                    Discount
                  </button>
                  <button className="action-btn note-btn" disabled={cart.length === 0}>
                    <FileText size={18} />
                    Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Customer Selection Modal */}
      {showCustomerModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Select Customer</h2>
              <button className="close-btn" onClick={() => setShowCustomerModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="customer-search">
                <Search size={18} />
                <input type="text" placeholder="Search customers..." />
              </div>
              <div className="customer-list">
                {mockCustomers.map(customer => (
                  <div 
                    key={customer.id} 
                    className={`customer-item ${selectedCustomer.id === customer.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowCustomerModal(false);
                    }}
                  >
                    <div className="customer-avatar">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="customer-details">
                      <h4>{customer.name}</h4>
                      {customer.phone && <p>{customer.phone}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <button className="new-customer-btn">
                <Plus size={18} />
                New Customer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal payment-modal">
            <div className="modal-header">
              <h2>Payment</h2>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="payment-details">
                <div className="payment-total">
                  <span>Total Amount</span>
                  <span className="amount">${total.toFixed(2)}</span>
                </div>
                
                <div className="payment-method-selector">
                  <h3>Payment Method</h3>
                  <div className="payment-methods">
                    <button 
                      className={`method-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('cash')}
                    >
                      <DollarSign size={18} />
                      Cash
                    </button>
                    <button 
                      className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard size={18} />
                      Card
                    </button>
                  </div>
                </div>
                
                {paymentMethod === 'cash' && (
                  <div className="cash-payment">
                    <div className="form-group">
                      <label>Amount Received</label>
                      <input 
                        type="number" 
                        value={paymentAmount} 
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        min={total}
                        step="0.01"
                      />
                    </div>
                    
                    <div className="quick-cash-options">
                      {[10, 20, 50, 100].map(amount => (
                        <button 
                          key={amount} 
                          onClick={() => setPaymentAmount(amount.toString())}
                          className="quick-cash-btn"
                        >
                          ${amount}
                        </button>
                      ))}
                      <button 
                        onClick={() => setPaymentAmount(total.toFixed(2))}
                        className="quick-cash-btn exact"
                      >
                        Exact
                      </button>
                    </div>
                    
                    {paymentAmount && parseFloat(paymentAmount) >= total && (
                      <div className="change-due">
                        <span>Change Due</span>
                        <span className="amount">${(parseFloat(paymentAmount) - total).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {paymentMethod === 'card' && (
                  <div className="card-payment">
                    <p className="card-instructions">
                      Please swipe card or insert chip on the terminal
                    </p>
                    <div className="card-amount">
                      <span>Charge Amount</span>
                      <span className="amount">${total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn" 
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button 
                className="process-btn" 
                onClick={processPayment}
                disabled={(paymentMethod === 'cash' && (!paymentAmount || parseFloat(paymentAmount) < total))}
              >
                {paymentMethod === 'card' ? 'Process Card' : 'Complete Sale'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;