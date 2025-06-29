import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  MapPin,
  Phone,
  DollarSign,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Plus,
  RefreshCw
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../style/orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mock orders data
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD-001',
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        customerPhone: '+1 234 567 8900',
        customerAddress: '123 Main St, City, State 12345',
        orderDate: '2024-06-29',
        orderTime: '10:30 AM',
        status: 'pending',
        total: 299.99,
        items: [
          { name: 'Smart Thermostat', quantity: 1, price: 199.99 },
          { name: 'Smart Bulbs (4-pack)', quantity: 1, price: 59.99 },
          { name: 'Motion Sensor', quantity: 2, price: 20.00 }
        ],
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid',
        shippingMethod: 'Standard Delivery',
        estimatedDelivery: '2024-07-02',
        notes: 'Customer requested contactless delivery'
      },
      {
        id: 'ORD-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@email.com',
        customerPhone: '+1 234 567 8901',
        customerAddress: '456 Oak Ave, City, State 12346',
        orderDate: '2024-06-29',
        orderTime: '02:15 PM',
        status: 'processing',
        total: 450.50,
        items: [
          { name: 'Security Camera System', quantity: 1, price: 299.99 },
          { name: 'Smart Lock', quantity: 1, price: 149.99 },
          { name: 'Installation Service', quantity: 1, price: 0.52 }
        ],
        paymentMethod: 'PayPal',
        paymentStatus: 'paid',
        shippingMethod: 'Express Delivery',
        estimatedDelivery: '2024-06-30',
        notes: 'Priority customer - VIP service'
      },
      {
        id: 'ORD-003',
        customerName: 'Mike Chen',
        customerEmail: 'mike.chen@email.com',
        customerPhone: '+1 234 567 8902',
        customerAddress: '789 Pine St, City, State 12347',
        orderDate: '2024-06-28',
        orderTime: '04:45 PM',
        status: 'shipped',
        total: 180.75,
        items: [
          { name: 'Smart Bulbs (2-pack)', quantity: 2, price: 29.99 },
          { name: 'Smart Switch', quantity: 3, price: 40.26 }
        ],
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid',
        shippingMethod: 'Standard Delivery',
        estimatedDelivery: '2024-07-01',
        trackingNumber: 'TRK123456789',
        notes: ''
      },
      {
        id: 'ORD-004',
        customerName: 'Emily Davis',
        customerEmail: 'emily.davis@email.com',
        customerPhone: '+1 234 567 8903',
        customerAddress: '321 Elm St, City, State 12348',
        orderDate: '2024-06-28',
        orderTime: '11:20 AM',
        status: 'delivered',
        total: 89.99,
        items: [
          { name: 'Smart Plug (4-pack)', quantity: 1, price: 39.99 },
          { name: 'Motion Sensor', quantity: 2, price: 25.00 }
        ],
        paymentMethod: 'Debit Card',
        paymentStatus: 'paid',
        shippingMethod: 'Standard Delivery',
        deliveredDate: '2024-06-29',
        notes: 'Left at front door as requested'
      },
      {
        id: 'ORD-005',
        customerName: 'Robert Wilson',
        customerEmail: 'robert.w@email.com',
        customerPhone: '+1 234 567 8904',
        customerAddress: '654 Maple Dr, City, State 12349',
        orderDate: '2024-06-27',
        orderTime: '03:10 PM',
        status: 'cancelled',
        total: 299.99,
        items: [
          { name: 'Smart Doorbell', quantity: 1, price: 199.99 },
          { name: 'Video Storage Plan', quantity: 1, price: 100.00 }
        ],
        paymentMethod: 'Credit Card',
        paymentStatus: 'refunded',
        shippingMethod: 'Express Delivery',
        notes: 'Customer changed mind - full refund processed'
      }
    ];
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      const matchesDate = dateFilter === 'all' || 
                         (dateFilter === 'today' && order.orderDate === '2024-06-29') ||
                         (dateFilter === 'yesterday' && order.orderDate === '2024-06-28') ||
                         (dateFilter === 'week' && new Date(order.orderDate) >= new Date('2024-06-23'));
      
      return matchesSearch && matchesStatus && matchesDate;
    });
    
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, orders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="status-icon pending" />;
      case 'processing': return <Package className="status-icon processing" />;
      case 'shipped': return <Truck className="status-icon shipped" />;
      case 'delivered': return <CheckCircle className="status-icon delivered" />;
      case 'cancelled': return <XCircle className="status-icon cancelled" />;
      default: return <Clock className="status-icon" />;
    }
  };

  const getStatusClass = (status) => {
    return `status-badge ${status}`;
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const exportOrders = () => {
    const dataStr = JSON.stringify(filteredOrders, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="orders-container">
      <Header notifications={3} />
      <Sidebar collapsed={sidebarCollapsed} toggleCollapse={toggleSidebar} />
      
      <div className={`orders-page ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Page Header */}
        <div className="orders-header">
          <div className="header-left">
            <h1>Orders Management</h1>
            <p>Manage and track all customer orders</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={exportOrders}>
              <Download size={18} />
              Export Orders
            </button>
            <button className="btn btn-primary">
              <Plus size={18} />
              New Order
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="orders-controls">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search orders by customer name, order ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filters">
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Date:</label>
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
              </select>
            </div>

            <button className="btn btn-icon">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Orders Stats */}
        <div className="orders-stats">
          <div className="stat-card">
            <div className="stat-icon pending">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <h3>{orders.filter(o => o.status === 'pending').length}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon processing">
              <Package size={24} />
            </div>
            <div className="stat-info">
              <h3>{orders.filter(o => o.status === 'processing').length}</h3>
              <p>Processing</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon shipped">
              <Truck size={24} />
            </div>
            <div className="stat-info">
              <h3>{orders.filter(o => o.status === 'shipped').length}</h3>
              <p>Shipped</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon delivered">
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <h3>{orders.filter(o => o.status === 'delivered').length}</h3>
              <p>Delivered</p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <span className="order-id">{order.id}</span>
                  </td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">{order.customerName}</div>
                      <div className="customer-email">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td>
                    <div className="date-time">
                      <div className="date">{order.orderDate}</div>
                      <div className="time">{order.orderTime}</div>
                    </div>
                  </td>
                  <td>
                    <div className={getStatusClass(order.status)}>
                      {getStatusIcon(order.status)}
                      <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                  </td>
                  <td>
                    <span className="order-total">${order.total.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className={`payment-status ${order.paymentStatus}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-icon btn-view"
                        onClick={() => handleViewOrder(order)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn btn-icon btn-edit"
                        title="Edit Order"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn btn-icon btn-delete"
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="no-orders">
              <ShoppingBag size={48} />
              <h3>No Orders Found</h3>
              <p>No orders match your current search criteria.</p>
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

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="modal-overlay" onClick={() => setShowOrderDetails(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order Details - {selectedOrder.id}</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowOrderDetails(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="order-details-grid">
                  {/* Customer Information */}
                  <div className="detail-section">
                    <h3><User size={20} /> Customer Information</h3>
                    <div className="detail-item">
                      <label>Name:</label>
                      <span>{selectedOrder.customerName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedOrder.customerEmail}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                    <div className="detail-item">
                      <label>Address:</label>
                      <span>{selectedOrder.customerAddress}</span>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="detail-section">
                    <h3><Package size={20} /> Order Information</h3>
                    <div className="detail-item">
                      <label>Order Date:</label>
                      <span>{selectedOrder.orderDate} at {selectedOrder.orderTime}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status:</label>
                      <div className={getStatusClass(selectedOrder.status)}>
                        {getStatusIcon(selectedOrder.status)}
                        <span>{selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Payment Method:</label>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="detail-item">
                      <label>Payment Status:</label>
                      <span className={`payment-status ${selectedOrder.paymentStatus}`}>
                        {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="detail-section">
                    <h3><Truck size={20} /> Shipping Information</h3>
                    <div className="detail-item">
                      <label>Shipping Method:</label>
                      <span>{selectedOrder.shippingMethod}</span>
                    </div>
                    <div className="detail-item">
                      <label>Estimated Delivery:</label>
                      <span>{selectedOrder.estimatedDelivery}</span>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="detail-item">
                        <label>Tracking Number:</label>
                        <span>{selectedOrder.trackingNumber}</span>
                      </div>
                    )}
                    {selectedOrder.deliveredDate && (
                      <div className="detail-item">
                        <label>Delivered Date:</label>
                        <span>{selectedOrder.deliveredDate}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="detail-section full-width">
                    <h3><ShoppingBag size={20} /> Order Items</h3>
                    <div className="items-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.name}</td>
                              <td>{item.quantity}</td>
                              <td>${item.price.toFixed(2)}</td>
                              <td>${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3"><strong>Total:</strong></td>
                            <td><strong>${selectedOrder.total.toFixed(2)}</strong></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <div className="detail-section full-width">
                      <h3>Notes</h3>
                      <p>{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <select 
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="status-update-select"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="btn btn-secondary" onClick={() => setShowOrderDetails(false)}>
                  Close
                </button>
                <button className="btn btn-primary">
                  Update Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
