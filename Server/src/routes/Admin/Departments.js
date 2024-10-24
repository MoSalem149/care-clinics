const express = require("express");
const route = express.Router();
const departmentModel = require("../../models/Departments.js");
const { uploadToFirebase } = require("../../middleWares/FireBase.js");
const router = require("../Images.js");
const {
  GetDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../../Controller/Admin/DepartmentController.js.js");
const authAdmin = require("../../middleWares/authAdmin.js");
const uploadSingleFile = require("../../middleWares/Images.js");

router.get("/", authAdmin, GetDepartment);

router.post(
  "/",
  authAdmin,
  uploadSingleFile,
  uploadToFirebase,
  createDepartment
);

router.put(
  "/:id",
  authAdmin,
  uploadSingleFile,
  // uploadToFirebase,
  updateDepartment
);

router.delete("/:id", authAdmin, deleteDepartment);

module.exports = router;
