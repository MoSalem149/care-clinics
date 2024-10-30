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
      additionalInfo.profileImage = req.body.ProfileImage;
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
    console.error("Error details:", error);
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentUserProfile = await UserProfile.findOne({ user: userId });
    if (!currentUserProfile) {
      return res.status(404).json({
        status: "FAIL",
        message: "User profile not found",
      });
    }
    const updatedData = { ...currentUserProfile._doc, ...req.body };
    if (req.file) {
      updatedData.profileImage = req.body.ProfileImage;
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

const isDayAvailable = (doctorAvailability, appointmentDay) => {
  return doctorAvailability.some(
    (availableDay) => availableDay.day === appointmentDay
  );
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

    // Get the day of the week for the appointment (e.g., Monday)
    const appointmentDay = appointmentDate.toLocaleString("en-US", {
      weekday: "long",
    });

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

    if (!doctor.availability || doctor.availability.length === 0) {
      return res.status(400).json({
        status: "ERROR",
        message: "Doctor working hours are not properly set.",
      });
    }

    // Check if the selected day is available for the doctor
    const dayAvailable = isDayAvailable(doctor.availability, appointmentDay);
    if (!dayAvailable) {
      return res.status(400).json({
        status: "ERROR",
        message: `Doctor is not available on ${appointmentDay}. Please select another day.`,
      });
    }

    const availableDay = doctor.availability.find(
      (availableDay) => availableDay.day === appointmentDay
    );

    const doctorStartTime = convertTo24HourTime(availableDay.startTime);
    const doctorEndTime = convertTo24HourTime(availableDay.endTime);

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
        message: `Appointment time must be between ${availableDay.startTime} and ${availableDay.endTime}.`,
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
      doctorName: doctor.name,
    });

    await appointment.save();

    const updatedUserProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          appointments: {
            appointmentId: appointment.appointmentId,
            appointmentTime: appointmentDate,
            appointmentDuration: appointmentDuration,
            appointmentEndTime: appointmentEndTime,
            doctorName: doctor.name, // إضافة اسم الطبيب هنا
          },
        },
      },
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
      data: {
        appointment,
        updatedUserProfile,
        updatedDoctorProfile,
        doctorName: doctor.name,
      },
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
    console.log("Starting updateAppointment...");

    const userId = req.user?.id;
    const appointmentId = req.params.appointmentId;
    const { appointmentTime } = req.body;

    const appointmentDate = new Date(appointmentTime);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid appointment time. Please provide a valid date.",
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.user.toString() !== userId) {
      return res.status(404).json({
        status: "FAIL",
        message:
          "Appointment not found or you do not have permission to update it.",
      });
    }

    const doctor = await Doctor.findById(appointment.doctor);
    if (!doctor) {
      return res.status(404).json({
        status: "FAIL",
        message: "Doctor not found",
      });
    }

    // Get the day of the week for the appointment
    const appointmentDay = appointmentDate.toLocaleString("en-US", {
      weekday: "long",
    });

    // Check if the selected day is available for the doctor
    const dayAvailable = isDayAvailable(doctor.availability, appointmentDay);
    if (!dayAvailable) {
      return res.status(400).json({
        status: "ERROR",
        message: `Doctor is not available on ${appointmentDay}. Please select another day.`,
      });
    }

    const availableDay = doctor.availability.find(
      (availableDay) => availableDay.day === appointmentDay
    );

    const doctorStartTime = convertTo24HourTime(availableDay.startTime);
    const doctorEndTime = convertTo24HourTime(availableDay.endTime);

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
        message: `Appointment time must be between ${availableDay.startTime} and ${availableDay.endTime}.`,
      });
    }

    // Calculate new appointment end time as 30 minutes after the appointment time
    let newAppointmentEndTime = new Date(
      appointmentDate.getTime() + 30 * 60000
    );

    // Check for overlapping appointments
    const overlappingAppointments = await Appointment.find({
      doctor: appointment.doctor,
      appointmentTime: {
        $lt: newAppointmentEndTime,
      },
      appointmentEndTime: {
        $gt: appointmentDate,
      },
    });

    if (overlappingAppointments.length > 0) {
      return res.status(400).json({
        status: "ERROR",
        message:
          "The appointment time overlaps with another appointment. Please choose a different time.",
      });
    }

    appointment.appointmentTime = appointmentDate;
    appointment.appointmentEndTime = newAppointmentEndTime;

    await appointment.save();

    const userProfileUpdate = await UserProfile.findOneAndUpdate(
      { user: userId, "appointments.appointmentId": appointmentId },
      {
        $set: {
          "appointments.$.appointmentTime": appointmentDate,
          "appointments.$.appointmentEndTime": newAppointmentEndTime,
        },
      },
      { new: true }
    );

    if (!userProfileUpdate) {
      console.error(
        `UserProfile not found or appointment not found for user ID: ${userId}`
      );
    } else {
      console.log("User profile updated:", userProfileUpdate);
    }

    const doctorUpdate = await Doctor.findOneAndUpdate(
      { _id: appointment.doctor, "appointments.appointmentId": appointmentId },
      {
        $set: {
          "appointments.$.appointmentTime": appointmentDate,
          "appointments.$.appointmentEndTime": newAppointmentEndTime,
        },
      },
      { new: true }
    );

    if (!doctorUpdate) {
      console.error(
        `Doctor not found or appointment not found for ID: ${appointment.doctor}`
      );
    } else {
      console.log("Doctor profile updated:", doctorUpdate);
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "Appointment updated successfully",
      data: { appointment },
    });
  } catch (error) {
    console.error("Error in updateAppointment:", error.message);
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the request
    const appointmentId = req.params.appointmentId; // Get the appointment ID from the request parameters

    console.log(`Starting deleteAppointment...`);
    console.log(`User ID: ${userId}, Appointment ID: ${appointmentId}`);

    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.user.toString() !== userId) {
      console.error(
        `Appointment not found or permission denied for ID: ${appointmentId}`
      );
      return res.status(404).json({
        status: "FAIL",
        message:
          "Appointment not found or you do not have permission to delete it.",
      });
    }

    // Remove the appointment from the user's profile
    const userProfileUpdate = await UserProfile.findOneAndUpdate(
      { user: userId },
      { $pull: { appointments: { appointmentId: appointmentId } } },
      { new: true } // Return the updated document
    );

    if (!userProfileUpdate) {
      console.error(`UserProfile not found for user ID: ${userId}`);
    } else {
      console.log(
        `Removed appointment from UserProfile: ${JSON.stringify(
          userProfileUpdate
        )}`
      );
    }

    // Remove the appointment from the doctor's profile
    const doctorUpdate = await Doctor.findByIdAndUpdate(
      appointment.doctor,
      { $pull: { appointments: { appointmentId: appointmentId } } }, // Ensure you are matching by _id
      { new: true } // Return the updated document
    );

    if (!doctorUpdate) {
      console.error(`Doctor not found for ID: ${appointment.doctor}`);
    } else {
      console.log(
        `Removed appointment from Doctor's profile: ${JSON.stringify(
          doctorUpdate
        )}`
      );
    }

    // Delete the appointment
    await Appointment.findByIdAndDelete(appointmentId);
    console.log(
      `Appointment with ID: ${appointmentId} deleted from appointments table.`
    );

    res.status(200).json({
      status: "SUCCESS",
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteAppointment:", error.message);
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfile = await UserProfile.findOne({ user: userId })
      .populate("appointments")
      .populate({
        path: "appointments",
        populate: {
          path: "doctor",
          select: "name specialization",
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
      data: { userProfile },
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};
const getDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== "doctor") {
      return res.status(403).json({
        status: "FAIL",
        message: "Unauthorized role. Only doctors can access this resource.",
      });
    }

    const doctorProfile = await Doctor.findOne({ user: userId }).populate({
      path: "appointments",
      select: "appointmentTime user",
      populate: {
        path: "user",
        select: "firstName lastName",
      },
    });

    if (!doctorProfile) {
      return res.status(404).json({
        status: "FAIL",
        message: "Doctor profile not found",
      });
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "Doctor profile retrieved successfully",
      data: { doctor: doctorProfile },
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const getAllUsersProfile = await UserProfile.find();
    res.status(201).json(getAllUsersProfile);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  addProfileInfo,
  updateUser,
  deleteAccount,
  bookAppointment,
  updateAppointment,
  deleteAppointment,
  getUserProfile,
  getDoctorProfile,
  getAllUsers,
};
