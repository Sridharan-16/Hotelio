const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Single', 'Double', 'Twin', 'Suite', 'Deluxe', 'Villa']
  },
  price: {
    type: Number,
    required: true
  },
  available: {
    type: Number,
    required: true,
    default: 0
  },
  amenities: [String],
  maxGuests: {
    type: Number,
    required: true
  }
});

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String }
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  amenities: [String],
  rooms: [roomSchema],
  policies: {
    checkIn: { type: String, default: '14:00' },
    checkOut: { type: String, default: '11:00' },
    cancellation: { type: String }
  },
  contact: {
    phone: { type: String },
    email: { type: String }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
hotelSchema.index({ name: 'text', description: 'text', 'address.city': 'text' });
hotelSchema.index({ 'address.city': 1 });
hotelSchema.index({ rating: -1 });
hotelSchema.index({ owner: 1 });
hotelSchema.index({ owner: 1, isActive: 1 });

module.exports = mongoose.model('Hotel', hotelSchema);

