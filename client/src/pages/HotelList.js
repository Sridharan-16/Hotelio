import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import FilterSidebar from '../components/FilterSidebar';
import './HotelList.css';

const HotelList = () => {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sortBy: 'rating'
  });

  useEffect(() => {
    fetchHotels();
  }, [searchParams, filters]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.city || searchParams.get('city')) {
        params.append('city', filters.city || searchParams.get('city'));
      }
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.rating) params.append('rating', filters.rating);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      
      const checkIn = searchParams.get('checkIn');
      const checkOut = searchParams.get('checkOut');
      if (checkIn) params.append('checkIn', checkIn);
      if (checkOut) params.append('checkOut', checkOut);
      if (searchParams.get('guests')) params.append('guests', searchParams.get('guests'));

      const response = await axios.get(`/api/hotels?${params.toString()}`);
      setHotels(response.data.hotels || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="hotel-list-page">
      <div className="container">
        <SearchBar
          initialData={{
            city: searchParams.get('city') || '',
            checkIn: searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')) : null,
            checkOut: searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')) : null,
            guests: { adults: 2, children: 0 }
          }}
        />

        <div className="hotel-list-content">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          
          <div className="hotels-grid">
            {loading ? (
              <div className="spinner"></div>
            ) : hotels.length === 0 ? (
              <div className="no-results">
                <h2>No hotels found</h2>
                <p>Try adjusting your search criteria</p>
              </div>
            ) : (
              hotels.map((hotel) => (
                <Link key={hotel._id} to={`/hotels/${hotel._id}`}>
                  <HotelCard hotel={hotel} />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelList;

