import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaChevronDown } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ initialData = {} }) => {
  const navigate = useNavigate();
  const [city, setCity] = useState(initialData.city || '');
  const [checkIn, setCheckIn] = useState(initialData.checkIn || null);
  const [checkOut, setCheckOut] = useState(initialData.checkOut || null);
  const [guests, setGuests] = useState(initialData.guests || { adults: 2, children: 0 });
  const [rooms, setRooms] = useState(1);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (checkIn) params.append('checkIn', checkIn.toISOString().split('T')[0]);
    if (checkOut) params.append('checkOut', checkOut.toISOString().split('T')[0]);
    params.append('guests', guests.adults + guests.children);
    
    navigate(`/hotels?${params.toString()}`);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month} '${year}`;
  };

  const formatDay = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatGuestsRooms = () => {
    const guestText = `${guests.adults} Adult${guests.adults !== 1 ? 's' : ''}${guests.children > 0 ? `, ${guests.children} Child${guests.children !== 1 ? 'ren' : ''}` : ''}`;
    return `${guestText} | ${rooms} Room${rooms !== 1 ? 's' : ''}`;
  };

  const minDate = new Date();
  const maxCheckOut = checkIn ? new Date(checkIn.getTime() + 30 * 24 * 60 * 60 * 1000) : null;

  return (
    <div className="goibibo-search-container">
      <h2 className="search-title">Book Hotels and Homestays</h2>
      <form onSubmit={handleSearch} className="goibibo-search-bar">
        <div className="search-field goibibo-field">
          <label>Where to</label>
          <input
            type="text"
            placeholder="e.g. - Area, Landmark or Property Name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="goibibo-input"
          />
        </div>

        <div className="search-field goibibo-field date-field">
          <label>Check-in</label>
          <div className="date-display" onClick={() => setShowDatePicker('checkin')}>
            {checkIn ? (
              <>
                <div className="date-main">{formatDate(checkIn)}</div>
                <div className="date-day">{formatDay(checkIn)}</div>
              </>
            ) : (
              <div className="date-placeholder">Select Date</div>
            )}
            <FaChevronDown className="chevron-icon" />
          </div>
          {showDatePicker === 'checkin' && (
            <div className="date-picker-wrapper">
              <DatePicker
                selected={checkIn}
                onChange={(date) => {
                  setCheckIn(date);
                  setShowDatePicker(null);
                }}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={minDate}
                inline
              />
            </div>
          )}
        </div>

        <div className="search-field goibibo-field date-field">
          <label>Check-out</label>
          <div className="date-display" onClick={() => setShowDatePicker('checkout')}>
            {checkOut ? (
              <>
                <div className="date-main">{formatDate(checkOut)}</div>
                <div className="date-day">{formatDay(checkOut)}</div>
              </>
            ) : (
              <div className="date-placeholder">Select Date</div>
            )}
            <FaChevronDown className="chevron-icon" />
          </div>
          {showDatePicker === 'checkout' && (
            <div className="date-picker-wrapper">
              <DatePicker
                selected={checkOut}
                onChange={(date) => {
                  setCheckOut(date);
                  setShowDatePicker(null);
                }}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={checkIn || minDate}
                maxDate={maxCheckOut}
                inline
              />
            </div>
          )}
        </div>

        <div className="search-field goibibo-field guest-field">
          <label>Guests & Rooms</label>
          <div
            className="guest-display"
            onClick={() => setShowGuestSelector(!showGuestSelector)}
          >
            {formatGuestsRooms()}
            <FaChevronDown className="chevron-icon" />
          </div>
          {showGuestSelector && (
            <div className="guest-selector goibibo-guest-selector">
              <div className="guest-option">
                <label>Adults</label>
                <div className="guest-controls">
                  <button
                    type="button"
                    onClick={() => setGuests({ ...guests, adults: Math.max(1, guests.adults - 1) })}
                    className="guest-btn"
                  >
                    -
                  </button>
                  <span>{guests.adults}</span>
                  <button
                    type="button"
                    onClick={() => setGuests({ ...guests, adults: guests.adults + 1 })}
                    className="guest-btn"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="guest-option">
                <label>Children</label>
                <div className="guest-controls">
                  <button
                    type="button"
                    onClick={() => setGuests({ ...guests, children: Math.max(0, guests.children - 1) })}
                    className="guest-btn"
                  >
                    -
                  </button>
                  <span>{guests.children}</span>
                  <button
                    type="button"
                    onClick={() => setGuests({ ...guests, children: guests.children + 1 })}
                    className="guest-btn"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="guest-option">
                <label>Rooms</label>
                <div className="guest-controls">
                  <button
                    type="button"
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                    className="guest-btn"
                  >
                    -
                  </button>
                  <span>{rooms}</span>
                  <button
                    type="button"
                    onClick={() => setRooms(rooms + 1)}
                    className="guest-btn"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="goibibo-search-btn">
          SEARCH
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
