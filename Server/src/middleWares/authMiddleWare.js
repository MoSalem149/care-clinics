const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, '72bdbb5bf2a6e022b0e1253ffe02f20cd25674c0eb673ccc7b1a66c44cd187f4');
    const user = await User.findById(decoded.id); 

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next(); 
  } catch (error) {
    res.status(401).json({
      status: 'FAIL',
      message: 'Authentication required',
    });
  }
};

module.exports = authMiddleware;
