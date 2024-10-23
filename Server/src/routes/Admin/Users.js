const express = require("express");
const router = express.Router();
const DoctorModel = require("../../models/Doctor");
const authAdmin = require("../../middleWares/authAdmin");
const { getAllUsers, GetOneUser } = require("../../Controller/user.controller");
const { auth } = require("firebase-admin");

router.get("/GetAllUsers", authAdmin, getAllUsers);
router.get("/GetOneUser/:id", authAdmin, GetOneUser);
module.exports = router;
