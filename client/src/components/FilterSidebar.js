import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ filters, onFilterChange }) => {
  const handleChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  return (
    <div className="filter-sidebar">
      <h3 className="filter-title">Filters</h3>

      <div className="filter-group">
        <label className="filter-label">Price Range</label>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="price-input"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="price-input"
          />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Minimum Rating</label>
        <div className="rating-options">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="rating-option">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating.toString()}
                onChange={(e) => handleChange('rating', e.target.value)}
              />
              <span>{rating}+ Stars</span>
            </label>
          ))}
          <label className="rating-option">
            <input
              type="radio"
              name="rating"
              value=""
              checked={filters.rating === ''}
              onChange={(e) => handleChange('rating', '')}
            />
            <span>Any</span>
          </label>
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          className="sort-select"
        >
          <option value="rating">Rating (High to Low)</option>
          <option value="priceLow">Price (Low to High)</option>
          <option value="priceHigh">Price (High to Low)</option>
          <option value="name">Name (A to Z)</option>
        </select>
      </div>

      <button
        onClick={() => onFilterChange({ minPrice: '', maxPrice: '', rating: '', sortBy: 'rating' })}
        className="btn btn-outline filter-reset"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterSidebar;

