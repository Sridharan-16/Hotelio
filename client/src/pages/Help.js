import React from 'react';
import './Help.css';

const Help = () => {
  return (
    <div className="help-page">
      <div className="container">
        <h1 className="help-title">Help & Support</h1>
        
        <div className="help-content">
          <div className="help-section">
            <h2>Frequently Asked Questions</h2>
            
            <div className="faq-item">
              <h3>How do I search for hotels?</h3>
              <p>Use the search bar on the home page to enter your destination city, select check-in and check-out dates, and specify the number of guests and rooms. Click "SEARCH" to view available hotels.</p>
            </div>

            <div className="faq-item">
              <h3>How do I make a booking?</h3>
              <p>After searching for hotels, click on any hotel to view details. Select your preferred room type and click "Book Now". Fill in your guest information and confirm the booking.</p>
            </div>

            <div className="faq-item">
              <h3>Can I cancel my booking?</h3>
              <p>Yes, you can cancel your booking from the "My Bookings" page. Cancellation policies vary by hotel and are displayed on the hotel details page.</p>
            </div>

            <div className="faq-item">
              <h3>How do I view my bookings?</h3>
              <p>After logging in, click on "My Bookings" in the navigation menu to view all your reservations.</p>
            </div>

            <div className="faq-item">
              <h3>What payment methods are accepted?</h3>
              <p>Currently, the platform supports various payment methods. Payment processing will be integrated in future updates.</p>
            </div>
          </div>

          <div className="help-section">
            <h2>Contact Us</h2>
            <p>If you need further assistance, please contact our support team:</p>
            <ul className="contact-list">
              <li><strong>Email:</strong> support@dpg.com</li>
              <li><strong>Phone:</strong> +91-1800-XXX-XXXX</li>
              <li><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM IST</li>
            </ul>
          </div>

          <div className="help-section">
            <h2>Booking Tips</h2>
            <ul className="tips-list">
              <li>Book in advance to get better rates</li>
              <li>Check hotel amenities before booking</li>
              <li>Read cancellation policies carefully</li>
              <li>Verify your booking details before confirming</li>
              <li>Keep your booking confirmation for reference</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;

