import React, { useState } from 'react';
import { Plus, Download, Upload, Edit, Search } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../style/employeeManagement.css';

const initialEmployees = [
  { id: 1, name: 'John Doe', role: 'Admin', email: 'john@shs.com', phone: '077123456', hireDate: '2024-01-15', status: 'Active' },
  { id: 2, name: 'Mary', role: 'Cashier', email: 'mary@shs.com', phone: '077234567', hireDate: '2024-02-01', status: 'Active' },
  { id: 3, name: 'Bob', role: 'Manager', email: 'bob@shs.com', phone: '077345678', hireDate: '2024-01-20', status: 'Active' },
];

const roles = ['Admin', 'Cashier', 'Manager'];
const statuses = ['Active', 'Inactive'];

const EmployeeManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState(2);
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    hireDate: '',
    status: 'Active'
  });

  // Pagination
  const itemsPerPage = 5;
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) &&
    (roleFilter === '' || emp.role === roleFilter) &&
    (statusFilter === '' || emp.status === statusFilter)
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentItems = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddEmployee = (e) => {
    e.preventDefault();
    setEmployees([
      ...employees,
      { id: employees.length + 1, ...newEmployee }
    ]);
    setIsAddModalOpen(false);
    setNewEmployee({
      name: '',
      role: '',
      email: '',
      phone: '',
      hireDate: '',
      status: 'Active'
    });
  };

  return (
    <div className="employee-management-container">
      <Header notifications={notifications} />
      <div className="main-content">
        <Sidebar
          collapsed={sidebarCollapsed}
          toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="employee-management-main">
          <div className="employee-header">
            <h1>EMPLOYEE MANAGEMENT</h1>
          </div>
          <div className="action-buttons">
            <button className="action-btn add-btn" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} /> Add Employee
            </button>
            <button className="action-btn export-btn">
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
                  <th>Act</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.name}</td>
                    <td>{emp.role}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.hireDate}</td>
                    <td>
                      <span className={`status-badge ${emp.status === 'Active' ? 'active' : 'inactive'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <button className="icon-btn edit-btn" title="Edit">
                        <Edit size={16} />
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
                    <button type="submit" className="submit-btn">Add</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployeeManagement;