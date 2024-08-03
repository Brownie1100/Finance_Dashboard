import React, { useState, useEffect } from 'react';
import getHelloMessage from './api.js';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

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
      <div className="App-header">
        {/* <h1>FINANCE DASHBOARD</h1> */}
        <h1>DASHBOARD</h1>
      </div>

      <div className="sheets">
        <div className="Dashboard">
          <h1>{message}</h1>
        </div>

        <div className="Income">
          <h1>{message}</h1>
        </div>

        <div className="Expense">
          <h1>{message}</h1>
        </div>
      </div> 
    </div>
  );
} 

export default App;