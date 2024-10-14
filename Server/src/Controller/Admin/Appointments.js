const appointments = require("../../models/AppointmentModel");
const getAllAppointments = async (req, res) => {
  try {
    const allAppointment = await appointments.find({});
    res.status(201).json(allAppointment);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = getAllAppointments;
