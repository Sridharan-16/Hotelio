import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../context/AuthContext';
import './Booking.css';

const Booking = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    roomType: searchParams.get('roomType') || '',
    checkIn: null,
    checkOut: null,
    guests: { adults: 2, children: 0 },
    rooms: 1,
    guestDetails: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: ''
    },
    specialRequests: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/booking/' + hotelId);
      return;
    }
    fetchHotel();
  }, [hotelId, isAuthenticated]);

  const fetchHotel = async () => {
    try {
      const response = await axios.get(`/api/hotels/${hotelId}`);
      setHotel(response.data);
      if (response.data.rooms && response.data.rooms.length > 0 && !formData.roomType) {
        setFormData({ ...formData, roomType: response.data.rooms[0].type });
      }
    } catch (error) {
      toast.error('Error loading hotel details');
      navigate('/hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleGuestChange = (type, value) => {
    setFormData({
      ...formData,
      guests: {
        ...formData.guests,
        [type]: parseInt(value) || 0
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const bookingData = {
        ...formData,
        hotel: hotelId,
        checkIn: formData.checkIn.toISOString(),
        checkOut: formData.checkOut.toISOString()
      };

      await axios.post('/api/bookings', bookingData);
      toast.success('Booking confirmed successfully!');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating booking');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRoom = hotel?.rooms?.find(r => r.type === formData.roomType);
  const nights = formData.checkIn && formData.checkOut
    ? Math.ceil((formData.checkOut - formData.checkIn) / (1000 * 60 * 60 * 24))
    : 0;
  const totalPrice = selectedRoom ? selectedRoom.price * formData.rooms * nights : 0;

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!hotel) {
    return <div className="container">Hotel not found</div>;
  }

  return (
    <div className="booking-page">
      <div className="container">
        <h1 className="page-title">Complete Your Booking</h1>

        <div className="booking-content">
          <div className="booking-form-section">
            <div className="booking-card">
              <h2>Hotel Details</h2>
              <div className="hotel-summary">
                <h3>{hotel.name}</h3>
                <p>{hotel.address?.city}, {hotel.address?.state}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="booking-card">
                <h2>Room Selection</h2>
                <div className="form-group">
                  <label>Room Type</label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    {hotel.rooms?.map((room, index) => (
                      <option key={index} value={room.type}>
                        {room.type} - ₹{room.price}/night (Max {room.maxGuests} guests)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Check-in Date</label>
                    <DatePicker
                      selected={formData.checkIn}
                      onChange={(date) => setFormData({ ...formData, checkIn: date })}
                      minDate={new Date()}
                      placeholderText="Select check-in date"
                      className="input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Check-out Date</label>
                    <DatePicker
                      selected={formData.checkOut}
                      onChange={(date) => setFormData({ ...formData, checkOut: date })}
                      minDate={formData.checkIn || new Date()}
                      placeholderText="Select check-out date"
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Adults</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.guests.adults}
                      onChange={(e) => handleGuestChange('adults', e.target.value)}
                      className="input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Children</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.guests.children}
                      onChange={(e) => handleGuestChange('children', e.target.value)}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Rooms</label>
                    <input
                      type="number"
                      name="rooms"
                      min="1"
                      value={formData.rooms}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="booking-card">
                <h2>Guest Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="guestDetails.firstName"
                      value={formData.guestDetails.firstName}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="guestDetails.lastName"
                      value={formData.guestDetails.lastName}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="guestDetails.email"
                      value={formData.guestDetails.email}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="guestDetails.phone"
                      value={formData.guestDetails.phone}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Special Requests (Optional)</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    className="input"
                    rows="4"
                    placeholder="Any special requests or notes..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={submitting || !formData.checkIn || !formData.checkOut}
              >
                {submitting ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>

          <div className="booking-summary-section">
            <div className="booking-card summary-card">
              <h2>Booking Summary</h2>
              {selectedRoom && (
                <>
                  <div className="summary-item">
                    <span>Room Type:</span>
                    <span>{selectedRoom.type}</span>
                  </div>
                  <div className="summary-item">
                    <span>Price per night:</span>
                    <span>₹{selectedRoom.price}</span>
                  </div>
                  <div className="summary-item">
                    <span>Nights:</span>
                    <span>{nights}</span>
                  </div>
                  <div className="summary-item">
                    <span>Rooms:</span>
                    <span>{formData.rooms}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-item total">
                    <span>Total Amount:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

