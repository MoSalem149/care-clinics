const express = require("express");
const router = express.Router();
const upload = require("../../middleWares/Images");
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

router.get("/", authAdmin, GetAllDoctors);

router.get("/:id", authAdmin, GetOneDoctor);

router.post("/", authAdmin, upload.single("ProfileImage"), CreateDoctor);

router.put("/:id", authAdmin, upload.single("ProfileImage"), UpdateDoctor);

router.delete("/:id", authAdmin, DeleteDoctor);

router.put("/:id", authAdmin, approveDoctor);

module.exports = router;
