const UserProfile = require("../models/userProfileModel");
const User = require("../models/userModel");
const Appointment = require("../models/AppointmentModel");
const Doctor = require("../models/Doctor");
const appointmentEmails = require("../Tools/EmailServices");
const appointmentDuration = 30;

const addProfileInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const additionalInfo = req.body;

    if (req.file) {
      additionalInfo.profileImage = req.file.firebaseUrl;
    }
    let userProfile;

    if (userRole === "user") {
      userProfile = new UserProfile({
        ...additionalInfo,
        user: userId,
      });
    } else {
      return res.status(403).json({
        status: "FAIL",
        message: "Unauthorized role",
      });
    }

    await userProfile.save();

    res.status(200).json({
      status: "SUCCESS",
      message: "Profile information saved successfully",
      data: { user: userProfile },
    });   
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;
    if (req.file) {
      updatedData.profileImage = req.file.firebaseUrl;
    }

    const userProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { $set: updatedData },
      { new: true, runValidators: true }
    ).populate({
      path: "appointments",
      select: "appointmentTime doctor",
      populate: {
        path: "doctor",
        select: "name",
      },
    });

    if (!userProfile) {
      return res.status(404).json({
        status: "FAIL",
        message: "User profile not found",
      });
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "Profile updated successfully",
      data: { user: userProfile },
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedProfile = await UserProfile.findOneAndDelete({ user: userId });
    if (!deletedProfile) {
      return res.status(404).json({
        status: "FAIL",
        message: "User profile not found",
      });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({
        status: "FAIL",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "User account and profile deleted successfully",
      data: { profile: deletedProfile },
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

const convertTo24HourTime = (timeString) => {
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};

const convertTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const isOverlappingAppointment = async (
  doctorId,
  appointmentStart,
  appointmentEnd
) => {
  const overlappingAppointment = await Appointment.findOne({
    doctor: doctorId,
    $or: [
      { appointmentTime: { $lt: appointmentEnd, $gte: appointmentStart } },
      { appointmentEndTime: { $gt: appointmentStart, $lte: appointmentEnd } },
      {
        appointmentTime: { $lte: appointmentStart },
        appointmentEndTime: { $gte: appointmentEnd },
      },
    ],
  });
  return overlappingAppointment ? true : false;
};

const bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const doctorId = req.params.doctorId;
    const { appointmentTime } = req.body;

    const appointmentDate = new Date(appointmentTime);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid appointment time. Please provide a valid date.",
      });
    }

    const appointmentEndTime = new Date(
      appointmentDate.getTime() + appointmentDuration * 60000
    );

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        status: "FAIL",
        message: "Doctor not found",
      });
    }

    if (!doctor.availability[0].startTime || !doctor.availability[0].endTime) {
      return res.status(400).json({
        status: "ERROR",
        message: "Doctor working hours are not properly set.",
      });
    }

    const doctorStartTime = convertTo24HourTime(
      doctor.availability[0].startTime
    );
    const doctorEndTime = convertTo24HourTime(doctor.availability[0].endTime);

    const appointmentHoursMinutes = `${String(
      appointmentDate.getUTCHours()
    ).padStart(2, "0")}:${String(appointmentDate.getUTCMinutes()).padStart(
      2,
      "0"
    )}`;
    const doctorStartTimeByMinutes = convertTimeToMinutes(doctorStartTime);
    const doctorEndTimeByMinutes = convertTimeToMinutes(doctorEndTime);
    const appointmentTimeByMinutes = convertTimeToMinutes(
      appointmentHoursMinutes
    );

    if (
      appointmentTimeByMinutes < doctorStartTimeByMinutes ||
      appointmentTimeByMinutes > doctorEndTimeByMinutes
    ) {
      return res.status(400).json({
        status: "ERROR",
        message: `Appointment time must be between ${doctor.availability[0].startTime} and ${doctor.availability[0].endTime}.`,
      });
    }

    const isOverlapping = await isOverlappingAppointment(
      doctorId,
      appointmentDate,
      appointmentEndTime
    );
    if (isOverlapping) {
      return res.status(400).json({
        status: "ERROR",
        message:
          "The appointment time overlaps with another appointment. Please choose a different time.",
      });
    }

    const appointment = new Appointment({
      user: userId,
      doctor: doctorId,
      appointmentTime: appointmentDate,
      appointmentDuration: appointmentDuration,
      appointmentEndTime: appointmentEndTime,
    });

    await appointment.save();

    const updatedUserProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { $push: { appointments: appointment } },
      { new: true }
    ).populate("appointments");

    const updatedDoctorProfile = await Doctor.findByIdAndUpdate(
      doctorId,
      { $push: { appointments: appointment } },
      { new: true }
    ).populate("appointments");

    const [user, doctorUser] = await Promise.all([
      User.findById(userId),
      User.findOne({ _id: doctor.user, role: "doctor" }),
    ]);

    await appointmentEmails(user, doctorUser, appointmentDate, "New");

    res.status(201).json({
      status: "SUCCESS",
      message: "Appointment booked successfully",
      data: { appointment, updatedUserProfile, updatedDoctorProfile },
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointmentId = req.params.appointmentId;
    const appointmentTime = req.body;

    const appointmentDate = new Date(appointmentTime);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid appointment time. Please provide a valid date.",
      });
    }

    const appointmentEndTime = new Date(
      appointmentDate.getTime() + appointmentDuration * 60000
    );

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.user.toString() !== userId) {
      return res.status(404).json({
        status: "FAIL",
        message:
          "Appointment not found or you do not have permission to update it.",
      });
    }

    const isOverlapping = await isOverlappingAppointment(
      appointment.doctor,
      appointmentDate,
      appointmentEndTime
    );
    if (isOverlapping) {
      return res.status(400).json({
        status: "ERROR",
        message:
          "The appointment time overlaps with another appointment. Please choose a different time.",
      });
    }

    appointment.appointmentTime = appointmentDate;
    appointment.appointmentEndTime = appointmentEndTime;

    await appointment.save();

    const [user, doctorUser] = await Promise.all([
      User.findById(userId),
      User.findOne({ _id: appointment.doctor.user, role: "doctor" }),
    ]);

    await appointmentEmails(user, doctorUser, appointmentDate, "Updated");

    res.status(200).json({
      status: "SUCCESS",
      message: "Appointment updated successfully",
      data: { appointment },
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointmentId = req.params.appointmentId;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.user.toString() !== userId) {
      return res.status(404).json({
        status: "FAIL",
        message:
          "Appointment not found or you do not have permission to delete it.",
      });
    }

    await Appointment.findByIdAndDelete(appointmentId);

    await UserProfile.findOneAndUpdate(
      { user: userId },
      { $pull: { appointments: appointmentId } }
    );

    await Doctor.findByIdAndUpdate(appointment.doctor, {
      $pull: { appointments: appointmentId },
    });

    const [user, doctorUser] = await Promise.all([
      User.findById(userId),
      User.findOne({ _id: appointment.doctor.user, role: "doctor" }),
    ]);

    await appointmentEmails(
      user,
      doctorUser,
      appointment.appointmentTime,
      "Deleted"
    );

    res.status(204).json({
      status: "SUCCESS",
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

module.exports = {
  addProfileInfo,
  updateUser,
  deleteAccount,
  bookAppointment,
  updateAppointment,
  deleteAppointment,
};
