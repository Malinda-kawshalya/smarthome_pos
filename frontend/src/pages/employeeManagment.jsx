import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, Edit, Search, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../style/employeeManagement.css';

const roles = ['Admin', 'Cashier', 'Manager'];
const statuses = ['Active', 'Inactive'];

const EmployeeManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState(2);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    hireDate: '',
    status: 'Active'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/employees');
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await response.json();
        setEmployees(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Pagination
  const itemsPerPage = 5;
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) &&
    (roleFilter === '' || emp.role === roleFilter) &&
    (statusFilter === '' || emp.status === statusFilter)
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentItems = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newEmployee)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add employee');
      }
      
      const addedEmployee = await response.json();
      setEmployees([...employees, addedEmployee]);
      setIsAddModalOpen(false);
      setNewEmployee({
        name: '',
        role: '',
        email: '',
        phone: '',
        hireDate: '',
        status: 'Active'
      });
    } catch (err) {
      console.error('Error adding employee:', err);
      alert('Failed to add employee: ' + err.message);
    }
  };

  const handleEditClick = (employee) => {
    setCurrentEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${currentEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(currentEmployee)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update employee');
      }
      
      const updatedEmployee = await response.json();
      setEmployees(employees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      ));
      setIsEditModalOpen(false);
      setCurrentEmployee(null);
    } catch (err) {
      console.error('Error updating employee:', err);
      alert('Failed to update employee: ' + err.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert('Failed to delete employee: ' + err.message);
    }
  };

  const exportEmployees = () => {
    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      "ID,Name,Role,Email,Phone,Hire Date,Status\n" +
      employees.map(emp => 
        `${emp.id},${emp.name},${emp.role},${emp.email},${emp.phone},${emp.hireDate},${emp.status}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="loading-container">Loading employee data...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="employee-management-container">
      <Header notifications={notifications} />
      <Sidebar
        collapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`employee-management-page ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="employee-header">
          <div className="header-left">
            <h1>Employee Management</h1>
            <p>Manage your team members and their roles</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{employees.length}</span>
              <span className="stat-label">Total Employees</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{employees.filter(emp => emp.status === 'Active').length}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="action-btn add-btn" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Add Employee
          </button>
          <button className="action-btn export-btn" onClick={exportEmployees}>
            <Download size={16} /> Export
          </button>
          <button className="action-btn import-btn">
            <Upload size={16} /> Import
          </button>
        </div>

        <div className="filter-section">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search employees..."
              className="search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <label>Role:</label>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="">All</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="filter-dropdown">
            <label>Status:</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="employee-table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Hire Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div className="employee-info">
                      <div className="employee-name">{emp.name}</div>
                      <div className="employee-id">ID: {emp.id}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${emp.role.toLowerCase()}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.hireDate}</td>
                  <td>
                    <span className={`status-badge ${emp.status === 'Active' ? 'active' : 'inactive'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-row">
                      <button 
                        className="icon-btn edit-btn" 
                        title="Edit" 
                        onClick={() => handleEditClick(emp)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="icon-btn delete-btn" 
                        title="Delete"
                        onClick={() => handleDeleteEmployee(emp.id)}
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

        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="pagination-btn"
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
                <h2>Add Employee</h2>
                <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>×</button>
              </div>
              <form onSubmit={handleAddEmployee}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    required
                    value={newEmployee.name}
                    onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      required
                      value={newEmployee.role}
                      onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    >
                      <option value="">Select Role</option>
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      required
                      value={newEmployee.status}
                      onChange={e => setNewEmployee({ ...newEmployee, status: e.target.value })}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      required
                      value={newEmployee.email}
                      onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      required
                      value={newEmployee.phone}
                      onChange={e => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Hire Date</label>
                  <input
                    type="date"
                    required
                    value={newEmployee.hireDate}
                    onChange={e => setNewEmployee({ ...newEmployee, hireDate: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                  <button type="submit" className="submit-btn">Add Employee</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditModalOpen && currentEmployee && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Edit Employee</h2>
                <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>×</button>
              </div>
              <form onSubmit={handleUpdateEmployee}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    required
                    value={currentEmployee.name}
                    onChange={e => setCurrentEmployee({ ...currentEmployee, name: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      required
                      value={currentEmployee.role}
                      onChange={e => setCurrentEmployee({ ...currentEmployee, role: e.target.value })}
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      required
                      value={currentEmployee.status}
                      onChange={e => setCurrentEmployee({ ...currentEmployee, status: e.target.value })}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      required
                      value={currentEmployee.email}
                      onChange={e => setCurrentEmployee({ ...currentEmployee, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      required
                      value={currentEmployee.phone}
                      onChange={e => setCurrentEmployee({ ...currentEmployee, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Hire Date</label>
                  <input
                    type="date"
                    required
                    value={currentEmployee.hireDate}
                    onChange={e => setCurrentEmployee({ ...currentEmployee, hireDate: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                  <button type="submit" className="submit-btn">Update Employee</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;