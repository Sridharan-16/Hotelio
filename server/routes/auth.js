const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { authenticateToken, requireAdmin, requireApprovedOwner } = require('../middleware/roles');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/profile-photos');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    cb(null, extname);
  }
});

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', {
    expiresIn: '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({ name, email, password, phone });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', auth, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone } = req.body;
    const userId = req.user._id;

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already taken by another user' });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// @route   POST /api/auth/upload-profile-photo
// @desc    Upload user profile photo
router.post('/upload-profile-photo', auth, upload.single('profilePhoto'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user._id;
    const profilePhotoPath = `/uploads/profile-photos/${req.file.filename}`;

    // Get current user to check for old profile photo
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile photo if it exists
    if (currentUser.profilePhoto && currentUser.profilePhoto !== profilePhotoPath) {
      const oldPhotoPath = path.join(__dirname, '..', currentUser.profilePhoto);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
        console.log('Deleted old profile photo:', currentUser.profilePhoto);
      }
    }

    // Update user with new profile photo path
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePhoto: profilePhotoPath },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile photo uploaded successfully',
      profilePhoto: profilePhotoPath
    });
  } catch (error) {
    console.error('Profile photo upload error:', error);
    res.status(500).json({ message: 'Server error during profile photo upload' });
  }
});

// @route   POST /api/auth/request-owner-access
// @desc    Request owner access
router.post('/request-owner-access', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if user already has a pending or approved request
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin users cannot request owner access' });
    }

    if (user.role === 'owner' && user.ownerRequest?.status === 'approved') {
      return res.status(400).json({ message: 'You already have approved owner access' });
    }

    if (user.ownerRequest?.status === 'pending') {
      return res.status(400).json({ message: 'You already have a pending owner request' });
    }

    // Update user with owner request
    user.ownerRequest = {
      requested: true,
      requestedAt: new Date(),
      status: 'pending',
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null
    };

    await user.save();

    res.json({
      message: 'Owner access request submitted successfully',
      status: 'pending',
      requestedAt: user.ownerRequest.requestedAt
    });
  } catch (error) {
    console.error('Owner request error:', error);
    res.status(500).json({ message: 'Server error during owner request' });
  }
});

// @route   GET /api/auth/owner-requests
// @desc    Get all owner requests (admin only)
router.get('/owner-requests', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build filter
    const filter = { 'ownerRequest.requested': true };
    if (status) {
      filter['ownerRequest.status'] = status;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { 'ownerRequest.requestedAt': -1 },
      select: '-password'
    };

    const requests = await User.find(filter)
      .select('name email role ownerRequest')
      .sort({ 'ownerRequest.requestedAt': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get owner requests error:', error);
    res.status(500).json({ message: 'Server error fetching owner requests' });
  }
});

// @route   POST /api/auth/approve-owner-request/:userId
// @desc    Approve owner request (admin only)
router.post('/approve-owner-request/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.ownerRequest?.requested) {
      return res.status(400).json({ message: 'No owner request found for this user' });
    }

    if (user.ownerRequest.status === 'approved') {
      return res.status(400).json({ message: 'Owner request already approved' });
    }

    // Update user role and request status
    user.role = 'owner';
    user.ownerRequest.status = 'approved';
    user.ownerRequest.reviewedAt = new Date();
    user.ownerRequest.reviewedBy = adminId;
    user.ownerRequest.rejectionReason = null;

    await user.save();

    res.json({
      message: 'Owner request approved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ownerRequest: user.ownerRequest
      }
    });
  } catch (error) {
    console.error('Approve owner request error:', error);
    res.status(500).json({ message: 'Server error approving owner request' });
  }
});

// @route   POST /api/auth/reject-owner-request/:userId
// @desc    Reject owner request (admin only)
router.post('/reject-owner-request/:userId', [
  body('rejectionReason').trim().isLength({ min: 1, max: 500 }).withMessage('Rejection reason is required (max 500 characters)')
], authenticateToken, requireAdmin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const { rejectionReason } = req.body;
    const adminId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.ownerRequest?.requested) {
      return res.status(400).json({ message: 'No owner request found for this user' });
    }

    if (user.ownerRequest.status === 'rejected') {
      return res.status(400).json({ message: 'Owner request already rejected' });
    }

    // Update request status (keep role as 'user')
    user.ownerRequest.status = 'rejected';
    user.ownerRequest.reviewedAt = new Date();
    user.ownerRequest.reviewedBy = adminId;
    user.ownerRequest.rejectionReason = rejectionReason;

    await user.save();

    res.json({
      message: 'Owner request rejected successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ownerRequest: user.ownerRequest
      }
    });
  } catch (error) {
    console.error('Reject owner request error:', error);
    res.status(500).json({ message: 'Server error rejecting owner request' });
  }
});

// @route   GET /api/auth/my-owner-request
// @desc    Get current user's owner request status
router.get('/my-owner-request', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('ownerRequest role');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      role: user.role,
      ownerRequest: user.ownerRequest
    });
  } catch (error) {
    console.error('Get owner request status error:', error);
    res.status(500).json({ message: 'Server error fetching owner request status' });
  }
});

module.exports = router;

