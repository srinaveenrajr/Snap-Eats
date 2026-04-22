const User = require('../models/User');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User profile not found'
      });
    }

    const profileData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      addressLabel: user.addressLabel,
      isProfileComplete: user.isProfileComplete,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      data: {
        user: profileData
      },
      message: 'Profile retrieved successfully'
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile',
      message: 'An error occurred while fetching profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, addressLabel } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User profile not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (addressLabel) user.addressLabel = addressLabel;

    // Save updated user (this will trigger the profile completion check)
    await user.save();

    const updatedProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      addressLabel: user.addressLabel,
      isProfileComplete: user.isProfileComplete,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      data: {
        user: updatedProfile
      },
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: errors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      message: 'An error occurred while updating profile'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
