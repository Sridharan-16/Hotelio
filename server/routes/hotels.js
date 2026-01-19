const express = require('express');
const Hotel = require('../models/Hotel');

const router = express.Router();

// @route   GET /api/hotels
// @desc    Get all hotels with filters
router.get('/', async (req, res) => {
  try {
    const {
      city,
      search,
      minPrice,
      maxPrice,
      rating,
      amenities,
      checkIn,
      checkOut,
      guests,
      sortBy = 'rating',
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    if (amenities) {
      query.amenities = { $in: Array.isArray(amenities) ? amenities : [amenities] };
    }

    // Price filter (applied to rooms)
    let priceFilter = {};
    if (minPrice || maxPrice) {
      priceFilter = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
    }

    // Sort options
    const sortOptions = {
      rating: { rating: -1, reviewCount: -1 },
      priceLow: { 'rooms.price': 1 },
      priceHigh: { 'rooms.price': -1 },
      name: { name: 1 }
    };

    const sort = sortOptions[sortBy] || sortOptions.rating;

    // Execute query
    let hotels = await Hotel.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Apply price filter if needed
    if (Object.keys(priceFilter).length > 0) {
      hotels = hotels.map(hotel => {
        const filteredRooms = hotel.rooms.filter(room => {
          if (minPrice && room.price < minPrice) return false;
          if (maxPrice && room.price > maxPrice) return false;
          return true;
        });
        return { ...hotel.toObject(), rooms: filteredRooms };
      }).filter(hotel => hotel.rooms.length > 0);
    }

    // Get total count for pagination
    const total = await Hotel.countDocuments(query);

    res.json({
      hotels,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalHotels: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hotels/:id
// @desc    Get single hotel by ID
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel || !hotel.isActive) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json(hotel);
  } catch (error) {
    console.error('Get hotel error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hotels/cities/list
// @desc    Get list of cities with hotels
router.get('/cities/list', async (req, res) => {
  try {
    const cities = await Hotel.distinct('address.city', { isActive: true });
    res.json(cities.sort());
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

