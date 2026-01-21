import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hotelio-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <span className="logo-text">
              <span className="hotelio-h">H</span>
              <span className="fascinate-regular">otelio</span>
            </span>
            <p className="footer-tagline">Your gateway to amazing stays worldwide</p>
          </div>
          <div className="footer-description">
            <p>Discover and book perfect accommodations for your travels. From luxury hotels to cozy homestays, we have it all.</p>
          </div>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaLinkedin />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/hotels">Hotels</Link></li>
            <li><Link to="/my-bookings">My Bookings</Link></li>
            <li><Link to="/help">Help & Support</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Popular Destinations</h3>
          <ul className="footer-links">
            <li><Link to="/hotels?city=Mumbai">Mumbai</Link></li>
            <li><Link to="/hotels?city=Delhi">Delhi</Link></li>
            <li><Link to="/hotels?city=Bangalore">Bangalore</Link></li>
            <li><Link to="/hotels?city=Goa">Goa</Link></li>
            <li><Link to="/hotels?city=Kerala">Kerala</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Travel Categories</h3>
          <ul className="footer-links">
            <li><Link to="/hotels?category=beach">Beach Resorts</Link></li>
            <li><Link to="/hotels?category=mountain">Mountain Hotels</Link></li>
            <li><Link to="/hotels?category=luxury">Luxury Stays</Link></li>
            <li><Link to="/hotels?category=budget">Budget Hotels</Link></li>
            <li><Link to="/hotels?category=business">Business Hotels</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact Info</h3>
          <div className="contact-info">
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>support@hotelio.com</span>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>+91 98765 43210</span>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>TamilNadu, India</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            <p>&copy; {currentYear} Hotelio. All rights reserved.</p>
          </div>
          <div className="payment-methods">
            <span className="payment-text">We Accept:</span>
            <FaCcVisa className="payment-icon" />
            <FaCcMastercard className="payment-icon" />
            <FaCcAmex className="payment-icon" />
            <FaPaypal className="payment-icon" />
          </div>
          <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
