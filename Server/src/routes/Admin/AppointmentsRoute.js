const express = require("express");
const route = express.Router();
const authAdmin = require("../../middleWares/authAdmin.js");
const getAllAppointments = require("../../Controller/Admin/Appointments.js");

route.get("/Appointments", authAdmin, getAllAppointments);

module.exports = route;
