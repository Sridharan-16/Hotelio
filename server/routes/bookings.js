const express = require('express');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
router.post('/', auth, [
  body('hotel').notEmpty().withMessage('Hotel ID is required'),
  body('roomType').notEmpty().withMessage('Room type is required'),
  body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
  body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
  body('guests.adults').isInt({ min: 1 }).withMessage('At least one adult is required'),
  body('rooms').isInt({ min: 1 }).withMessage('At least one room is required'),
  body('guestDetails.firstName').notEmpty().withMessage('First name is required'),
  body('guestDetails.lastName').notEmpty().withMessage('Last name is required'),
  body('guestDetails.email').isEmail().withMessage('Valid email is required'),
  body('guestDetails.phone').notEmpty().withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      hotel: hotelId,
      roomType,
      checkIn,
      checkOut,
      guests,
      rooms,
      guestDetails,
      specialRequests
    } = req.body;

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Get hotel and validate room availability
    const hotel = await Hotel.findById(hotelId);
    if (!hotel || !hotel.isActive) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const selectedRoom = hotel.rooms.find(r => r.type === roomType);
    if (!selectedRoom) {
      return res.status(400).json({ message: 'Room type not available' });
    }

    if (selectedRoom.available < rooms) {
      return res.status(400).json({ message: 'Not enough rooms available' });
    }

    if (selectedRoom.maxGuests * rooms < guests.adults + (guests.children || 0)) {
      return res.status(400).json({ message: 'Room capacity exceeded' });
    }

    // Calculate total price
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = selectedRoom.price * rooms * nights;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      hotel: hotelId,
      roomType,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      rooms,
      totalPrice,
      guestDetails,
      specialRequests,
      status: 'confirmed'
    });

    await booking.save();

    // Update hotel room availability
    selectedRoom.available -= rooms;
    await hotel.save();

    // Populate hotel details in response
    await booking.populate('hotel', 'name address images rating');

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('hotel', 'name address images rating')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Restore room availability
    const hotel = await Hotel.findById(booking.hotel);
    const room = hotel.rooms.find(r => r.type === booking.roomType);
    if (room) {
      room.available += booking.rooms;
      await hotel.save();
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

