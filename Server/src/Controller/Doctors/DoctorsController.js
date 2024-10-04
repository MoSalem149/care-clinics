const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const doctorModel = require("../../models/Doctor");
dotenv.config();

const getResetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(404).json({ message: "Invalid Or Missing Token" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const doctorEmail = decode.email;
    res.status(201).json({ email: doctorEmail });
  } catch (error) {
    console.error("Invalid Token", error);
    return res.status(500).json({ error: "Invalid Or Expired Token" });
  }
};

const postResetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const authorHeader = req.headers["authorization"];
    if (!authorHeader || !authorHeader.startsWith("Bearer ")) {
      return res
        .status(400)
        .json({ error: "Authorization token is missing or invalid." });
    }
    const token = authorHeader.split(" ")[1];
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required." });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const doctorEmail = decode.email;
    const doctor = await doctorModel.findOne({ email: doctorEmail });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor Not Found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    doctor.password = hashedPassword;
    await doctor.save();
    res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    console.error("Error Resseting Password", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = { getResetPassword, postResetPassword };
