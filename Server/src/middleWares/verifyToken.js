const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeader) {
    res.json({ error: "token is required" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ error: "Token is required." });
  }
  try {
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = decodedToken;

    next();
  } catch (err) {
    res.status(401).json({ err: "invalid token" });
  }
};
module.exports = {
  verifyToken,
};
