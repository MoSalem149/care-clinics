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

router.get("/", GetDepartment);

router.post("/", upload.single("image"), createDepartment);

router.put("/:id", upload.single("image"), updateDepartment);

router.delete("/:id", deleteDepartment);

module.exports = router;
