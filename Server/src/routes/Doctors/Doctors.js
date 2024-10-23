const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const upload = require("../../middleWares/Images");
const DoctorModel = require("../../models/Doctor");
const { verifyToken } = require("../../middleWares/verifyToken");
const authMiddleware = require("../../middleWares/authMiddleWare");
const userProfile = require("../../Controller/userProfile.controller");


const {
  getResetPassword,
  postResetPassword,
  signupDoctor,
  compeleteDoctorProfile,
  UpdateDoctor,
  DeleteDoctor,
} = require("../../Controller/Doctors/DoctorsController");

router.get("/reset-password", getResetPassword);

router.post("/reset-password", postResetPassword);

router.post("/signup-doctor", signupDoctor);

router.post(
  "/compelete-profile",
  verifyToken,
  upload.single("profileImage"),
  compeleteDoctorProfile
);
 
router.put(
  "/update-doctor/:id",
  verifyToken,
  upload.single("profileImage"), 
  UpdateDoctor
);

router
.route("/profile")
.get(authMiddleware, userProfile.getDoctorProfile);

router.delete("/delete-doctor/:id", verifyToken, DeleteDoctor);

module.exports = router;
   