const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const DoctorModel = require("../../models/Doctor");
const {
  getResetPassword,
  postResetPassword,
} = require("../../Controller/Doctors/DoctorsController");

router.get("/reset-password", getResetPassword);

router.post("/reset-password", postResetPassword);

module.exports = router;
