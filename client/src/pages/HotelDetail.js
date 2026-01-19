import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaMapMarkerAlt, FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaDumbbell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './HotelDetail.css';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchHotel();
  }, [id]);

  const fetchHotel = async () => {
    try {
      const response = await axios.get(`/api/hotels/${id}`);
      setHotel(response.data);
      if (response.data.rooms && response.data.rooms.length > 0) {
        setSelectedRoom(response.data.rooms[0]);
      }
    } catch (error) {
      console.error('Error fetching hotel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/booking/' + id);
      return;
    }
    navigate(`/booking/${id}?roomType=${selectedRoom?.type || ''}`);
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'WiFi': FaWifi,
      'Parking': FaParking,
      'Pool': FaSwimmingPool,
      'Restaurant': FaUtensils,
      'Gym': FaDumbbell
    };
    return iconMap[amenity] || null;
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!hotel) {
    return <div className="container">Hotel not found</div>;
  }

  return (
    <div className="hotel-detail-page">
      <div className="container">
        <div className="hotel-detail-header">
          <h1 className="hotel-detail-name">{hotel.name}</h1>
          <div className="hotel-detail-location">
            <FaMapMarkerAlt className="location-icon" />
            <span>{hotel.address?.street}, {hotel.address?.city}, {hotel.address?.state}</span>
          </div>
          {hotel.rating > 0 && (
            <div className="hotel-detail-rating">
              <FaStar className="star-icon" />
              <span>{hotel.rating.toFixed(1)}</span>
              <span className="review-count">({hotel.reviewCount} reviews)</span>
            </div>
          )}
        </div>

        <div className="hotel-images">
          {hotel.images && hotel.images.length > 0 ? (
            <>
              <div className="main-image">
                <img
                  src={hotel.images[0].url}
                  alt={hotel.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x500?text=Hotel+Image';
                  }}
                />
              </div>
              {hotel.images.length > 1 && (
                <div className="thumbnail-images">
                  {hotel.images.slice(1, 5).map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={image.alt || hotel.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x150?text=Hotel+Image';
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="main-image placeholder">
              <span>No Images Available</span>
            </div>
          )}
        </div>

        <div className="hotel-detail-content">
          <div className="hotel-detail-main">
            <div className="section">
              <h2>Description</h2>
              <p>{hotel.description}</p>
            </div>

            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="section">
                <h2>Amenities</h2>
                <div className="amenities-grid">
                  {hotel.amenities.map((amenity, index) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div key={index} className="amenity-item">
                        {Icon && <Icon className="amenity-icon" />}
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {hotel.policies && (
              <div className="section">
                <h2>Policies</h2>
                <div className="policies">
                  <div className="policy-item">
                    <strong>Check-in:</strong> {hotel.policies.checkIn}
                  </div>
                  <div className="policy-item">
                    <strong>Check-out:</strong> {hotel.policies.checkOut}
                  </div>
                  {hotel.policies.cancellation && (
                    <div className="policy-item">
                      <strong>Cancellation:</strong> {hotel.policies.cancellation}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hotel-detail-sidebar">
            <div className="booking-card">
              <h3>Select Room</h3>
              {hotel.rooms && hotel.rooms.length > 0 ? (
                <>
                  <div className="room-options">
                    {hotel.rooms.map((room, index) => (
                      <div
                        key={index}
                        className={`room-option ${selectedRoom?.type === room.type ? 'selected' : ''}`}
                        onClick={() => setSelectedRoom(room)}
                      >
                        <div className="room-info">
                          <h4>{room.type}</h4>
                          <div className="room-details">
                            <span>Max Guests: {room.maxGuests}</span>
                            {room.amenities && room.amenities.length > 0 && (
                              <span>{room.amenities.length} amenities</span>
                            )}
                          </div>
                        </div>
                        <div className="room-price">
                          <span className="price">₹{room.price}</span>
                          <span className="unit">/night</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedRoom && (
                    <div className="booking-summary">
                      <div className="summary-row">
                        <span>Price per night:</span>
                        <span>₹{selectedRoom.price}</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total:</span>
                        <span>₹{selectedRoom.price}</span>
                      </div>
                    </div>
                  )}
                  <button onClick={handleBookNow} className="btn btn-primary btn-block">
                    Book Now
                  </button>
                </>
              ) : (
                <p>No rooms available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;

