const UserProfile = require('../models/userProfileModel');
const User = require('../models/userModel');
const Appointment = require('../models/AppointmentModel');
const Doctor = require('../models/Doctor');
const appointmentDuration=30;

// Add profile information for the user
const addProfileInfo = async (req, res) => {
  try {
    const userId = req.user.id; 
    const userRole = req.user.role;
    const additionalInfo = req.body; 

    let userProfile;

    if (userRole === 'user') {
      userProfile = new UserProfile({
        ...additionalInfo, 
        user: userId,    
      });
    } else if (userRole === 'doctor') {
      userProfile = new Doctor({
        ...additionalInfo, 
        doctor: userId,    
      });
    } else {
      return res.status(403).json({
        status: 'FAIL',
        message: 'Unauthorized role',
      });
    }

    await userProfile.save();

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Profile information saved successfully',
      data: { user: userProfile },
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
    });
  }
};

// Update user's profile information and populate appointments
const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; 
    const updatedData = req.body;

    // Update UserProfile based on userId and provided data, populate appointments
    const userProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { $set: updatedData },
      { new: true, runValidators: true }
    ).populate({
      path: 'appointments',
      select: 'appointmentTime doctor',
      populate: {
        path: 'doctor',
        select: 'name',
      },
    });

    if (!userProfile) {
      return res.status(404).json({
        status: 'FAIL',
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Profile updated successfully',
      data: { user: userProfile },
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
    });
  }
};

// Delete user's account and profile 
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; 

    // Delete user's profile
    const deletedProfile = await UserProfile.findOneAndDelete({ user: userId });
    if (!deletedProfile) {
      return res.status(404).json({
        status: 'FAIL',
        message: 'User profile not found',
      });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({
        status: 'FAIL',
        message: 'User not found',
      });
    }
    
    res.status(200).json({
      status: 'SUCCESS',
      message: 'User account and profile deleted successfully',
      data: { profile: deletedProfile },
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
    });
  }
};

const convertTo24HourTime = (timeString) => {
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};

const convertTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Function to check if the appointment overlaps with another appointment
const isOverlappingAppointment = async (doctorId, appointmentStart, appointmentEnd) => {
  const overlappingAppointment = await Appointment.findOne({
    doctor: doctorId,
    $or: [
      { appointmentTime: { $lt: appointmentEnd, $gte: appointmentStart } },
      { appointmentEndTime: { $gt: appointmentStart, $lte: appointmentEnd } },
      { appointmentTime: { $lte: appointmentStart }, appointmentEndTime: { $gte: appointmentEnd } }
    ]
  });
  return overlappingAppointment ? true : false;
};

// Function to book an appointment
const bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const doctorId=req.params.doctorId
    const { appointmentTime } = req.body;

    // Validate the appointment time
    const appointmentDate = new Date(appointmentTime);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Invalid appointment time. Please provide a valid date.',
      });
    }

    const appointmentEndTime = new Date(appointmentDate.getTime() + appointmentDuration * 60000);
 
    // Check if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        status: 'FAIL',
        message: 'Doctor not found',
      });
    }

    // Check if doctor's availability is defined
    if (!doctor.availability[0].startTime || !doctor.availability[0].endTime) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Doctor working hours are not properly set.',
      });
    }

    // Convert doctor's startTime and endTime to 24-hour format
    const doctorStartTime = convertTo24HourTime(doctor.availability[0].startTime);
    const doctorEndTime = convertTo24HourTime(doctor.availability[0].endTime);

    const appointmentHoursMinutes = `${String(appointmentDate.getUTCHours()).padStart(2, '0')}:${String(appointmentDate.getUTCMinutes()).padStart(2, '0')}`;
    const doctorStartTimeByMinutes = convertTimeToMinutes(doctorStartTime);
    const doctorEndTimeByMinutes = convertTimeToMinutes(doctorEndTime);
    const appointmentTimeByMinutes = convertTimeToMinutes(appointmentHoursMinutes);

    // Check if the appointment time is within the doctor's working hours
    if (appointmentTimeByMinutes < doctorStartTimeByMinutes || appointmentTimeByMinutes > doctorEndTimeByMinutes) {
      return res.status(400).json({
        status: 'ERROR',
        message: `Appointment time must be between ${doctor.availability[0].startTime} and ${doctor.availability[0].endTime}.`,
      });
    }

    // Check if the appointment overlaps with any existing appointments
    const isOverlapping = await isOverlappingAppointment(doctorId, appointmentDate, appointmentEndTime);
    if (isOverlapping) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'The appointment time overlaps with another appointment. Please choose a different time.',
      });
    }

    // Create a new appointment
    const appointment = new Appointment({
      user: userId,
      doctor: doctorId,
      appointmentTime: appointmentDate,
      appointmentDuration: appointmentDuration,
      appointmentEndTime: appointmentEndTime 
    });

    await appointment.save();

    // Update user and doctor profiles
    const updatedUserProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { $push: { appointments: appointment } },
      { new: true }
    ).populate('appointments');

    const updatedDoctorProfile = await Doctor.findByIdAndUpdate(
      doctorId,
      { $push: { appointments: appointment } },
      { new: true }
    ).populate('appointments');

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Appointment booked successfully',
      data: { appointment, updatedUserProfile, updatedDoctorProfile },
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
    });
  }
};
// Update an appointment
const updateAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointmentId = req.params.appointmentId; 
    const appointmentTime  = req.body; 

    // Validate the appointment time
    const appointmentDate = new Date(appointmentTime);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Invalid appointment time. Please provide a valid date.',
      });
    }

    const appointmentEndTime = new Date(appointmentDate.getTime() + appointmentDuration * 60000);

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.user.toString() !== userId) {
      return res.status(404).json({
        status: 'FAIL',
        message: 'Appointment not found or you do not have permission to update it.',
      });
    }

    // Check if the new appointment time overlaps with any existing appointments
    const isOverlapping = await isOverlappingAppointment(appointment.doctor, appointmentDate, appointmentEndTime);
    if (isOverlapping) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'The new appointment time overlaps with another appointment. Please choose a different time.',
      });
    }

    // Update appointment details
    appointment.appointmentTime = appointmentDate;
    appointment.appointmentEndTime = appointmentEndTime;
    await appointment.save();

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Appointment updated successfully',
      data: { appointment },
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
    });
  }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.params;

    // Check if the appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.user.toString() !== userId) {
      return res.status(404).json({
        status: 'FAIL',
        message: 'Appointment not found or you do not have permission to delete it.',
      });
    }

    // Delete the appointment
    await Appointment.findByIdAndDelete(appointmentId);

    // Remove appointment reference from UserProfile
    await UserProfile.findOneAndUpdate(
      { user: userId },
      { $pull: { appointments: appointmentId } }
    );

    // Remove appointment reference from Doctor
    await Doctor.findByIdAndUpdate(
      appointment.doctor,
      { $pull: { appointments: appointmentId } }
    );

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
    });
  }
};

// Get the doctor's profile along with appointment details
const getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const doctor = await Doctor.findById(doctorId)
      .populate({
        path: 'appointments',
        select: 'appointmentTime user',
        populate: {
          path: 'user',
          select: 'name',
        },
      });

    if (!doctor) {
      return res.status(404).json({
        status: 'FAIL',
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      data: { doctor },
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
    });
  }
};

// Get the user's profile along with appointment details
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await UserProfile.findOne({ user: userId })
      .populate({
        path: 'appointments',
        select: 'appointmentTime doctor',
        populate: {
          path: 'doctor',
          select: 'name',
        },
      });

    if (!userProfile) {
      return res.status(404).json({
        status: 'FAIL',
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      status: 'SUCCESS',
      data: { user: userProfile },
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
    });
  }
};

module.exports = { 
  addProfileInfo, 
  updateUser, 
  deleteAccount, 
  bookAppointment, 
  getDoctorProfile, 
  getUserProfile,
  updateAppointment,
  deleteAppointment
};
