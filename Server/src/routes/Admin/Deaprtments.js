const express = require("express");
const route = express.Router();
const departmentModel = require("../../models/Departments");
const upload = require("../../middleWares/Images");
const router = require("../Images");
const {
  GetDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../../Controller/Admin/DepartmentController.js.js");
const authAdmin = require("../../middleWares/authAdmin.js");

router.get("/", authAdmin, GetDepartment);

router.post("/", authAdmin, upload.single("image"), createDepartment);

router.put("/:id", authAdmin, upload.single("image"), updateDepartment);

router.delete("/:id", authAdmin, deleteDepartment);

module.exports = router;
