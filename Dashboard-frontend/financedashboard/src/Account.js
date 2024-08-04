import React, { useState } from 'react';
import './Account.css';

function Account({details}) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="account-container">
      <button className="account-button" onClick={toggleVisibility}>
        <img
          src="https://via.placeholder.com/40" // Replace with an actual image URL or path
          alt="Account"
          className="profile-pic"
        />
      </button>
      {isVisible && (
        <div className="account-details">
          <ul className='lists'>
            <li>{details}</li>
            <li>Tea</li>
            <li><a href="/Login">Logout</a></li>
          </ul> 
        </div>
      )}
    </div>
  );
}

export default Account;
