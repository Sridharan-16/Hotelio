import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './MyBookings.css';

const MyBookings = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await axios.put(`/api/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error cancelling booking');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: '#10b981',
      pending: '#f59e0b',
      cancelled: '#ef4444',
      completed: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="my-bookings-page">
      <div className="container">
        <h1 className="page-title">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <h2>No bookings found</h2>
            <p>You haven't made any bookings yet.</p>
            <button
              onClick={() => navigate('/hotels')}
              className="btn btn-primary"
            >
              Browse Hotels
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-item">
                <div className="booking-header">
                  <div className="booking-hotel-info">
                    <h3>{booking.hotel?.name || 'Hotel'}</h3>
                    <p>{booking.hotel?.address?.city}, {booking.hotel?.address?.state}</p>
                  </div>
                  <div
                    className="booking-status"
                    style={{ backgroundColor: getStatusColor(booking.status) + '20', color: getStatusColor(booking.status) }}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <strong>Room Type:</strong> {booking.roomType}
                  </div>
                  <div className="detail-item">
                    <strong>Check-in:</strong> {formatDate(booking.checkIn)}
                  </div>
                  <div className="detail-item">
                    <strong>Check-out:</strong> {formatDate(booking.checkOut)}
                  </div>
                  <div className="detail-item">
                    <strong>Guests:</strong> {booking.guests.adults} Adult{booking.guests.adults !== 1 ? 's' : ''}
                    {booking.guests.children > 0 && `, ${booking.guests.children} Child${booking.guests.children !== 1 ? 'ren' : ''}`}
                  </div>
                  <div className="detail-item">
                    <strong>Rooms:</strong> {booking.rooms}
                  </div>
                  <div className="detail-item">
                    <strong>Total Price:</strong> ₹{booking.totalPrice}
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="booking-requests">
                    <strong>Special Requests:</strong> {booking.specialRequests}
                  </div>
                )}

                {booking.status === 'confirmed' && (
                  <div className="booking-actions">
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="btn btn-outline"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

