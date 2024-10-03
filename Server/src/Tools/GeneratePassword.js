const crypto = require("crypto");
const { models } = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function generateAdvancedPassword() {
  const upperCase = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  ).join("");
  const lowerCase = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(97 + i)
  ).join("");
  const digits = Array.from({ length: 10 }, (_, i) =>
    String.fromCharCode(48 + i)
  ).join("");
  const specialChars = "!@#$%&";
  const characters = upperCase + lowerCase + digits + specialChars;

  let password = "";
  while (password.length < 12) {
    const newChar = characters.charAt(crypto.randomInt(0, characters.length));
    if (!password.includes(newChar)) {
      password += newChar;
    }
  }
  return password;
}

const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};
module.exports = {
  generateAdvancedPassword,
  generateResetToken,
  generateToken,
};
