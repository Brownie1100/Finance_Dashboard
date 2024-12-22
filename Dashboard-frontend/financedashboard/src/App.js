import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import getHelloMessage from './api.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Navbar from './Navbar.js';
import Account from './Account.js';
import Dashboard from './Dashboard.js';
import Income from './Income.js';
import Expense from './Expense.js';
import HomePage from './HomePage.js';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [message, setMessage] = useState('');
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isDashboard = location.pathname === "/Dashboard";
  const isIncome = location.pathname === "/Income";
  const isExpense = location.pathname === "/Expense";

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await getHelloMessage();
        setMessage(data);
      } catch (error) {
        console.error('Error fetching the message:', error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="App">
      {isHome&&
      <div>
        <HomePage/>
      </div>
      }

      {!isHome&&
      <div className="App-header">
        <Navbar/>
        <h1>FINANCE DASHBOARD</h1>
        <Account details="Srijan"/>
      </div>}
    
      <div className="sheets">
        {isDashboard&&
        <div className="Dashboard">
          <Routes>
            <Route path="/Dashboard" element={<Dashboard />} />
          </Routes>
          <h1>{message}</h1>
        </div>}

        {isIncome&&
        <div className="Income">
          <h1>{message}</h1>
          <Routes>
            <Route path="/Income" element={<Income />} />
          </Routes>
        </div>}

        {isExpense&&
        <div className="Expense">
          <Routes>
            <Route path="/Expense" element={<Expense />} />
          </Routes>
          <h1>{message}</h1>
        </div>}
      </div> 
    </div>
  );
} 

export default App;