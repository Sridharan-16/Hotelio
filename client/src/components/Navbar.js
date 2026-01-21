import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaQuestionCircle, FaChevronDown } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
              <Link to="/hotels" className="hotels-link">
            <span>Hotels</span>
          </Link>
              <div className="navbar-user" ref={profileDropdownRef}>
                <button 
                  className="profile-avatar"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  aria-label="Profile menu"
                >
                  {user?.profilePhoto ? (
                    <img 
                      src={user.profilePhoto} 
                      alt="Profile" 
                      className="profile-photo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div className="default-avatar" style={{ display: user?.profilePhoto ? 'none' : 'block' }}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="19" fill="white" stroke="#FF5722" strokeWidth="1"/>
                      <circle cx="20" cy="15" r="5" fill="#FF5722"/>
                      <path d="M10 32C10 26.48 14.48 22 20 22C25.52 22 30 26.48 30 32" stroke="#FF5722" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>
                </button>
                
                {showProfileDropdown && (
                  <div className="profile-dropdown">
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FaUser className="dropdown-icon" />
                      <span>My Profile</span>
                    </Link>
                    <button 
                      className="dropdown-item dropdown-logout"
                      onClick={handleLogout}
                    >
                      <FaUser className="dropdown-icon" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/help" className="help-link">
                <FaQuestionCircle className="menu-icon" />
                <span>Help</span>
              </Link>
              <Link to="/hotels" className="hotels-link">
            <span>Hotels</span>
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

