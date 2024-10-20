const express = require("express");
const router = express.Router();
const uploadSingleFile = require("../../middleWares/Images");
const DoctorModel = require("../../models/Doctor");

const { model } = require("mongoose");
const {
  GetAllDoctors,
  GetOneDoctor,
  CreateDoctor,
  UpdateDoctor,
  DeleteDoctor,
  approveDoctor,
} = require("../../Controller/Admin/DoctorsController");
const authAdmin = require("../../middleWares/authAdmin.js");
const { uploadToFirebase } = require("../../middleWares/FireBase.js");

router.get("/", authAdmin, GetAllDoctors);

router.get("/:id", authAdmin, GetOneDoctor);

router.post("/", authAdmin, uploadSingleFile, uploadToFirebase, CreateDoctor);

router.put("/:id", authAdmin, uploadSingleFile, uploadToFirebase, UpdateDoctor);

router.delete("/:id", authAdmin, DeleteDoctor);

router.put("/Approve/:id", authAdmin, approveDoctor);

module.exports = router;
