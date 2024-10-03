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
} = require("../../Controller/Admin/DoctorsController");

router.get("/", GetAllDoctors);

router.get("/:id", GetOneDoctor);

router.post("/", upload.single("ProfileImage"), CreateDoctor);

router.put("/:id", upload.single("ProfileImage"), UpdateDoctor);

router.delete("/:id", DeleteDoctor);

module.exports = router;
