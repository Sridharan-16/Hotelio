const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate user with JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Role-based access control
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied - insufficient permissions',
        requiredRoles: allowedRoles,
        currentRole: req.user.role
      });
    }

    next();
  };
};

// Admin-only access
const requireAdmin = authorizeRoles('admin');

// Owner or Admin access
const requireOwnerOrAdmin = authorizeRoles('owner', 'admin');

// Owner-only access (excluding admin)
const requireOwnerOnly = authorizeRoles('owner');

// Check if user owns the resource
const checkOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Owner can only access their own resources
    const resourceUserId = req.params[resourceField] || req.body[resourceField];
    
    if (!resourceUserId) {
      return res.status(400).json({ message: 'Resource owner ID not specified' });
    }

    if (req.user._id.toString() !== resourceUserId.toString()) {
      return res.status(403).json({ 
        message: 'Access denied - you can only access your own resources',
        yourId: req.user._id,
        resourceId: resourceUserId
      });
    }

    next();
  };
};

// Check if user has approved owner status
const requireApprovedOwner = (req, res, next) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Owner access required' });
  }

  if (!req.user.ownerRequest || req.user.ownerRequest.status !== 'approved') {
    return res.status(403).json({ 
      message: 'Owner access not approved - please wait for admin approval',
      status: req.user.ownerRequest?.status || 'not_requested'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  requireAdmin,
  requireOwnerOrAdmin,
  requireOwnerOnly,
  checkOwnership,
  requireApprovedOwner
};
