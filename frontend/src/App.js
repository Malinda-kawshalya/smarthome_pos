import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import StockManagement from './pages/stockManagement';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EmployeeManagement from './pages/employeeManagment';
import POS from './pages/posInterface';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stock" element={<StockManagement />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/header" element={<Header />} />
          <Route path="/Sidebar" element={<Sidebar />} />
          <Route path="/employees" element={<EmployeeManagement />} />
          <Route path="/pos" element={<POS />} />
          {/* Add more routes as needed */}
          

        </Routes>
      </Router>
    </div>
  );
}

export default App;