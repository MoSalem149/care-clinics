const UserProfile = require('../models/userProfileModel');
const User=require('../models/userModel')

const addProfileInfo = async (req, res) => {
  try {
    const userId = req.user.id; 
    const additionalInfo = req.body; 

    const userProfile = new UserProfile({
      ...additionalInfo, 
      user: userId,    
    });

    await userProfile.save();
      
    res.status(200).json({   
      status: 'SUCCESS',
      message: 'Profile information saved successfully',
      data: { user: userProfile },
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; 
    const updatedData = req.body;

    const userProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { $set: updatedData },
      { new: true, runValidators: true }  
    );

    if (!userProfile) {  
      return res.status(404).json({
        status: 'FAIL',
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Profile updated successfully',
      data: { user: userProfile },
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; 
    const deletedProfile = await UserProfile.findOneAndDelete({ user: userId });

    if (!deletedProfile) {
      return res.status(404).json({
        status: 'FAIL',
        message: 'User profile not found',
      });
    }
   
    const deletedUser = await User.findByIdAndDelete(userId);
     
    if (!deletedUser) {
      console.log(userId);
      return res.status(404).json({
        status: 'FAIL',
        message: 'User not found',
      });
    }
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'User account and profile deleted successfully',
      data: { profile: deletedProfile },
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
    });
  }
};

module.exports = { addProfileInfo, updateUser, deleteAccount  };
