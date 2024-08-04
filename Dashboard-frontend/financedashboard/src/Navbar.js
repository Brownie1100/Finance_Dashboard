import React, { useEffect } from 'react';
import './Navbar.css'

function Navbar() {
  useEffect(() => {
    const hamMenu = document.querySelector('.ham-menu');
    const offScreenMenu = document.querySelector('.off-screen-menu');

    const handleClick = () => {
      hamMenu.classList.toggle('active');
      offScreenMenu.classList.toggle('active');
    };
    hamMenu.addEventListener('click', handleClick);
    return () => {
      hamMenu.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <><div className="off-screen-menu">
      <ul>
        <li><a href="/Dashboard">Dashboard</a></li>
        <li><a href="/Income">Income</a></li>
        <li><a href="/Expense">Expense</a></li>
      </ul>
    </div><nav>
        <div className="ham-menu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav></>
      
  );
}

export default Navbar;
