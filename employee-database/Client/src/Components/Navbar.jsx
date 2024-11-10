import React, { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  // Retrieve username from localStorage
  const storedUser = localStorage.getItem('userName');

  const handleLogout = () => {
    axios.post('http://localhost:3001/auth/logout', {}, { withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        localStorage.removeItem('userName');
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return (
    <Fragment>
      {isLoggedIn ? (
        <div className="navbar">
          <div className="navbar-links"> 

            <Link to="/home" className="navbar-link home-link">Home</Link>
            <Link to="/employeeList" className="navbar-link employeeList-link">EmployeeList</Link>

            <div className="navbar-box">
            <span className="navbar-username"> {storedUser}</span>

            <button className="navbar-button"  onClick={handleLogout}>Logout</button>
            </div>
          </div>
          </div>
      ) : (
        <></>
      )}
    </Fragment>
  );
}

export default Navbar;
