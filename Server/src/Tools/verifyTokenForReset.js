const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyTokenForReset = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return reject(err);
      }

      try {
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
          return reject(new Error("User not found"));
        }
        resolve(user);
      } catch (fetchError) {
        reject(fetchError);
      }
    });
  });
};

module.exports = { verifyTokenForReset };
