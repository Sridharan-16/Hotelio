import React from 'react';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import './HotelCard.css';

const HotelCard = ({ hotel }) => {
  const minPrice = hotel.rooms && hotel.rooms.length > 0
    ? Math.min(...hotel.rooms.map(room => room.price))
    : 0;

  return (
    <div className="hotel-card">
      <div className="hotel-image-container">
        {hotel.images && hotel.images.length > 0 ? (
          <img
            src={hotel.images[0].url}
            alt={hotel.images[0].alt || hotel.name}
            className="hotel-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Hotel+Image';
            }}
          />
        ) : (
          <div className="hotel-image-placeholder">
            <span>No Image</span>
          </div>
        )}
        {hotel.rating > 0 && (
          <div className="hotel-rating-badge">
            <FaStar className="star-icon" />
            <span>{hotel.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="hotel-info">
        <h3 className="hotel-name">{hotel.name}</h3>
        <div className="hotel-location">
          <FaMapMarkerAlt className="location-icon" />
          <span>{hotel.address?.city}, {hotel.address?.state}</span>
        </div>
        
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="hotel-amenities">
            {hotel.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="amenity-tag">{amenity}</span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="amenity-tag">+{hotel.amenities.length - 3} more</span>
            )}
          </div>
        )}

        <div className="hotel-footer">
          <div className="hotel-price">
            <span className="price-label">Starting from</span>
            <span className="price-amount">₹{minPrice}</span>
            <span className="price-unit">/night</span>
          </div>
          {hotel.reviewCount > 0 && (
            <div className="hotel-reviews">
              {hotel.reviewCount} review{hotel.reviewCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelCard;

