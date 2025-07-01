import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import StockManagement from './pages/stockManagement';
import EmployeeManagement from './pages/employeeManagment';
import POS from './pages/posInterface';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Analytics from './pages/Analytics';
import Orders from './pages/Orders';
import Products from './pages/Products';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stock" element={<StockManagement />} />
          <Route path="/products" element={<Products />} />
          <Route path="/employees" element={<EmployeeManagement />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;