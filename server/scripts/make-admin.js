const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function makeAdmin() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-reservation';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user by email and update to admin
    const email = 'sri@gmail.com';
    const result = await User.updateOne(
      { email: email },
      { 
        $set: { 
          role: 'admin',
          // Clear any owner request if exists
          ownerRequest: {
            requested: false,
            requestedAt: null,
            status: null,
            reviewedAt: null,
            reviewedBy: null,
            rejectionReason: null
          }
        }
      }
    );

    if (result.matchedCount === 0) {
      console.log(`User with email ${email} not found`);
    } else if (result.modifiedCount === 0) {
      console.log(`User ${email} is already an admin or no changes needed`);
    } else {
      console.log(`✅ Successfully made ${email} an admin`);
      
      // Verify the update
      const user = await User.findOne({ email: email });
      console.log('User details:', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error making admin:', error);
    process.exit(1);
  }
}

makeAdmin();
