import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaQuestionCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar hotelio-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">
            <span className="hotelio-h">H</span>
            <span className="fascinate-regular">otelio</span>
          </span>
        </Link>
        
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <Link to="/help" className="help-link">
                <FaQuestionCircle className="menu-icon" />
                <span>Help</span>
              </Link>
              <div className="navbar-user">
                <Link to="/profile" className="profileToLink">
                <span className="user-name">{user?.name}</span>
              </Link>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/help" className="help-link">
                <FaQuestionCircle className="menu-icon" />
                <span>Help</span>
              </Link>
              <Link to="/login" className="login-btn">
                <FaUser className="menu-icon" />
                <span>Login / Signup</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

