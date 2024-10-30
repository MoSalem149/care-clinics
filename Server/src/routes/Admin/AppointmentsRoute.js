const express = require("express");
const route = express.Router();
const getAllAppointments = require("../../Controller/Admin/Appointments.js");

route.get("/Appointments", getAllAppointments);

module.exports = route;
