import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const popularDestinations = [
    {
      name: 'Mumbai',
      description: 'Cosmopolitan and financial capital of India',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400',
      city: 'Mumbai'
    },
    {
      name: 'Ho Chi Minh',
      description: 'Economical, historical and entertainment centre of Vietnam',
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
      city: 'Ho Chi Minh'
    },
    {
      name: 'Paris',
      description: 'The City of Light',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
      city: 'Paris'
    },
    {
      name: 'Krabi',
      description: 'A quaint destination featuring endless natural beauty',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400',
      city: 'Krabi'
    },
    {
      name: 'Maldives',
      description: 'An ultimate luxurious and romantic holiday destination',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400',
      city: 'Maldives'
    },
    {
      name: 'Udaipur',
      description: "Crowned as India's most romantic city",
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      city: 'Udaipur'
    },
    {
      name: 'Phuket',
      description: 'A tropical paradise boasting of stunning beaches',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400',
      city: 'Phuket'
    },
    {
      name: 'Bali',
      description: 'Land of the Gods',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
      city: 'Bali'
    },
    {
      name: 'Shimla',
      description: 'Endearing combination of snow-covered peaks and blue sky',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400',
      city: 'Shimla'
    },
    {
      name: 'Hyderabad',
      description: 'The glorious city of Nizams known for radiant pearls',
      image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400',
      city: 'Hyderabad'
    },
    {
      name: 'Ooty',
      description: 'Endless natural beauty of the Nilgiris',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      city: 'Ooty'
    },
    {
      name: 'Dubai',
      description: 'Treasured gem of the Emirates',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
      city: 'Dubai'
    },
    {
      name: 'Langkawi',
      description: 'Picturesque island bordering azure blue waters',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400',
      city: 'Langkawi'
    },
    {
      name: 'Manali',
      description: 'Panoramic views of snow-laden mountains and dense deodar trees',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400',
      city: 'Manali'
    },
    {
      name: 'Amsterdam',
      description: 'Venice of the North',
      image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400',
      city: 'Amsterdam'
    },
    {
      name: 'Mysore',
      description: 'A royal city with grand palaces and heritage sites',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      city: 'Mysore'
    },
    {
      name: 'Munnar',
      description: 'Referred as the Kashmir of South India',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      city: 'Munnar'
    },
    {
      name: 'Bengaluru',
      description: 'Technology hub of India',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400',
      city: 'Bangalore'
    },
    {
      name: 'Singapore',
      description: 'The city of vast green spaces and glittering skyline',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400',
      city: 'Singapore'
    },
    {
      name: 'Amritsar',
      description: 'The Pool of Nectar',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      city: 'Amritsar'
    }
  ];

  const handleDestinationClick = (city) => {
    navigate(`/hotels?city=${city}`);
  };

  return (
    <div className="home goibibo-home">
      <div className="home-hero">
        <SearchBar />
      </div>

      <div className="popular-destinations-section">
        <div className="container">
          <h2 className="destinations-title">Popular Destinations</h2>
          <p className="destinations-subtitle">
            We have selected some best locations around the world for you.
          </p>
          <div className="destinations-grid">
            {popularDestinations.map((destination, index) => {
              // Assign dynamic size classes for a quilted/masonry effect
              let sizeClass = '';
              if (index % 7 === 0) sizeClass = 'large';
              else if (index % 7 === 1 || index % 7 === 2) sizeClass = 'tall';
              else if (index % 7 === 3 || index % 7 === 4) sizeClass = 'wide';
              // else default
              return (
                <div
                  key={index}
                  className={`destination-card ${sizeClass}`}
                  onClick={() => handleDestinationClick(destination.city)}
                >
                  <div className="destination-image">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';
                      }}
                    />
                    <div className="destination-content">
                      <h3 className="destination-name">{destination.name}</h3>
                      <p className="destination-description">{destination.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="offers-section">
        <div className="container">
          <h2 className="offers-title">Offers for you</h2>
          <div className="offers-carousel">
            <div className="offer-card">
              <div className="offer-image">
                <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400" alt="Travel offer" />
              </div>
              <div className="offer-content">
                <h3>Get Up To 15% Instant Discount!</h3>
                <p className="offer-validity">Valid till: *Limited Period Offers</p>
              </div>
            </div>

            <div className="offer-card">
              <div className="offer-image">
                <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400" alt="Travel offer" />
              </div>
              <div className="offer-content">
                <h3>Get Up to 15% OFF on Travel Bookings!</h3>
                <div className="offer-bank">
                  <span className="bank-logo">Central Bank of India</span>
                </div>
                <p className="offer-validity">Valid till: Limited Period Offers</p>
              </div>
            </div>

            <div className="offer-card">
              <div className="offer-image">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" alt="Travel offer" />
              </div>
              <div className="offer-content">
                <h3>Special Discount on Hotel Bookings!</h3>
                <div className="offer-bank">
                  <span className="bank-logo">AXIS BANK</span>
                  <span className="bank-tagline">dil se open</span>
                </div>
                <p className="offer-validity">Valid till: Limited Period</p>
              </div>
            </div>

            <div className="offer-card">
              <div className="offer-image">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" alt="Travel offer" />
              </div>
              <div className="offer-content">
                <h3>Special Discount on Hotel Bookings!</h3>
                <div className="offer-bank">
                  <span className="bank-logo">AXIS BANK</span>
                  <span className="bank-tagline">dil se open</span>
                </div>
                <p className="offer-validity">Valid till: Limited Period</p>
              </div>
            </div>
            
            <div className="offer-card">
              <div className="offer-image">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" alt="Travel offer" />
              </div>
              <div className="offer-content">
                <h3>Special Discount on Hotel Bookings!</h3>
                <div className="offer-bank">
                  <span className="bank-logo">AXIS BANK</span>
                  <span className="bank-tagline">dil se open</span>
                </div>
                <p className="offer-validity">Valid till: Limited Period</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="vacation-categories">
        <div className="container">
          <div className="categories-list">
            <a href="/hotels?category=beach" className="category-link">Beach Vacations</a>
            <a href="/hotels?category=weekend" className="category-link">Weekend Getaways</a>
            <a href="/hotels?category=mountain" className="category-link">Mountains Calling</a>
            <a href="/hotels?category=luxury" className="category-link">Stay Like Royals</a>
            <a href="/hotels?category=pilgrimage" className="category-link">Indian Pilgrimages</a>
            <a href="/hotels?category=party" className="category-link">Party Destinations</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
