// src/Navbar.js

import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './pages/AuthContext'; // Adjust the path based on your directory structure
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, username, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false); // Close dropdown on logout
    navigate('/login'); // Redirect to login page after logout
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  console.log('Navbar auth:', { isAuthenticated, username }); // Debugging

  return (
    <nav>
      <Link to="/recommendation" className="logo-link">
        <h1 className="logo">RareTrades</h1>
      </Link>
      <ul className="nav-links">
        {/* "Recommendations" link is always visible */}
        <li>
          <Link to="/recommendation">Recommendations</Link>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/ranking">Ranking</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li className="username-dropdown" ref={dropdownRef}>
              <span
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="username"
              >
                {username}
              </span>
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/dashboard">
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings">
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="logout-button">
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/login">Log In</Link>
            </li>
            <li>
              <Link to="/join">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
