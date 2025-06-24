import React from 'react';
import Dashboard from './pages/dashboard';
import StockManagement from './pages/stockManagement'; 
import './App.css';

function App() {
  return (
    <div className="App">
      <Dashboard />
      <StockManagement />
    </div>
  );
}

export default App;