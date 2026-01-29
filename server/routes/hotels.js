const express = require('express');
const { body, validationResult } = require('express-validator');
const Hotel = require('../models/Hotel');
const { authenticateToken, requireApprovedOwner, requireAdmin, checkOwnership } = require('../middleware/roles');

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

// @route   POST /api/hotels
// @desc    Create a new hotel (approved owners only)
router.post('/', authenticateToken, requireApprovedOwner, [
  body('name').trim().notEmpty().withMessage('Hotel name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('address.street').trim().notEmpty().withMessage('Street address is required'),
  body('address.city').trim().notEmpty().withMessage('City is required'),
  body('address.state').trim().notEmpty().withMessage('State is required'),
  body('address.zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('address.country').trim().notEmpty().withMessage('Country is required'),
  body('contact.phone').trim().notEmpty().withMessage('Phone number is required'),
  body('contact.email').isEmail().withMessage('Valid email is required'),
  body('rooms').isArray({ min: 1 }).withMessage('At least one room is required'),
  body('rooms.*.name').trim().notEmpty().withMessage('Room name is required'),
  body('rooms.*.price').isNumeric().withMessage('Room price must be a number'),
  body('rooms.*.capacity').isInt({ min: 1 }).withMessage('Room capacity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hotelData = {
      ...req.body,
      owner: req.user._id,
      isActive: true
    };

    const hotel = new Hotel(hotelData);
    await hotel.save();

    res.status(201).json({
      message: 'Hotel created successfully',
      hotel
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(500).json({ message: 'Server error creating hotel' });
  }
});

// @route   PUT /api/hotels/:id
// @desc    Update hotel (owner only)
router.put('/:id', authenticateToken, requireApprovedOwner, [
  body('name').optional().trim().notEmpty().withMessage('Hotel name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('address.street').optional().trim().notEmpty().withMessage('Street address cannot be empty'),
  body('address.city').optional().trim().notEmpty().withMessage('City cannot be empty'),
  body('address.state').optional().trim().notEmpty().withMessage('State cannot be empty'),
  body('address.zipCode').optional().trim().notEmpty().withMessage('Zip code cannot be empty'),
  body('address.country').optional().trim().notEmpty().withMessage('Country cannot be empty'),
  body('contact.phone').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
  body('contact.email').optional().isEmail().withMessage('Valid email is required'),
  body('rooms').optional().isArray().withMessage('Rooms must be an array'),
  body('rooms.*.name').optional().trim().notEmpty().withMessage('Room name cannot be empty'),
  body('rooms.*.price').optional().isNumeric().withMessage('Room price must be a number'),
  body('rooms.*.capacity').optional().isInt({ min: 1 }).withMessage('Room capacity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Check ownership (admin can update any hotel)
    if (req.user.role !== 'admin' && hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied - you can only update your own hotels' });
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Hotel updated successfully',
      hotel: updatedHotel
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({ message: 'Server error updating hotel' });
  }
});

// @route   DELETE /api/hotels/:id
// @desc    Delete hotel (owner only)
router.delete('/:id', authenticateToken, requireApprovedOwner, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Check ownership (admin can delete any hotel)
    if (req.user.role !== 'admin' && hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied - you can only delete your own hotels' });
    }

    await Hotel.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({ message: 'Server error deleting hotel' });
  }
});

// @route   GET /api/hotels/my-hotels
// @desc    Get current user's hotels (approved owners only)
router.get('/my-hotels', authenticateToken, requireApprovedOwner, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = 'all' // all, active, inactive
    } = req.query;

    // Build query
    const query = { owner: req.user._id };
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const hotels = await Hotel.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

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
    console.error('Get my hotels error:', error);
    res.status(500).json({ message: 'Server error fetching your hotels' });
  }
});

// @route   PATCH /api/hotels/:id/toggle-status
// @desc    Toggle hotel active status (owner only)
router.patch('/:id/toggle-status', authenticateToken, requireApprovedOwner, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Check ownership (admin can toggle any hotel)
    if (req.user.role !== 'admin' && hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied - you can only manage your own hotels' });
    }

    hotel.isActive = !hotel.isActive;
    await hotel.save();

    res.json({
      message: `Hotel ${hotel.isActive ? 'activated' : 'deactivated'} successfully`,
      hotel
    });
  } catch (error) {
    console.error('Toggle hotel status error:', error);
    res.status(500).json({ message: 'Server error toggling hotel status' });
  }
});

// @route   GET /api/hotels/owner/:ownerId
// @desc    Get hotels by owner ID (admin only)
router.get('/owner/:ownerId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { ownerId } = req.params;

    const hotels = await Hotel.find({ owner: ownerId })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Hotel.countDocuments({ owner: ownerId });

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
    console.error('Get hotels by owner error:', error);
    res.status(500).json({ message: 'Server error fetching hotels by owner' });
  }
});

module.exports = router;

