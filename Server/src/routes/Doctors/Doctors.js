const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const uploadSingleFile = require("../../middleWares/Images");
const DoctorModel = require("../../models/Doctor");
const { verifyToken } = require("../../middleWares/verifyToken");
const { uploadToFirebase } = require("../../middleWares/FireBase");
const {
  postResetPassword,
  getResetPassword,
  signupDoctor,
  compeleteDoctorProfile,
  UpdateDoctor,
  DeleteDoctor,
  getAllDoctors,
} = require("../../Controller/Doctors/DoctorsController");

router.get("/reset-password", getResetPassword);

router.post("/reset-password", postResetPassword);

router.get("/GetAllDoctors", getAllDoctors);

router.post("/signup-doctor", signupDoctor);

router.post(
  "/compelete-profile",
  verifyToken,
  uploadSingleFile,
  uploadToFirebase,
  compeleteDoctorProfile
);

router.put(
  "/update-doctor/:id",
  verifyToken,
  uploadSingleFile,
  uploadToFirebase,
  UpdateDoctor
);

router.delete("/delete-doctor/:id", verifyToken, DeleteDoctor);

module.exports = router;
