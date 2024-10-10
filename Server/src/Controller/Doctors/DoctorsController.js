const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const doctorModel = require("../../models/Doctor.js");
const departmentModel = require("../../models/Departments.js");
const User = require("../../models/userModel");
const { response } = require("express");
const { updateDepartment } = require("../Admin/DepartmentController.js");
const router = require("../../routes/Images.js");
dotenv.config();

const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;

const passwordRegex =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const getResetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(404).json({ message: "Invalid Or Missing Token" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const doctorEmail = decode.email;
    res.status(201).json({ email: doctorEmail });
  } catch (error) {
    console.error("Invalid Token", error);
    return res.status(500).json({ error: "Invalid Or Expired Token" });
  }
};

const postResetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const authorHeader = req.headers["authorization"];
    if (!authorHeader || !authorHeader.startsWith("Bearer ")) {
      return res
        .status(400)
        .json({ error: "Authorization token is missing or invalid." });
    }
    const token = authorHeader.split(" ")[1];
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required." });
    }
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password Must Be: Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const doctorEmail = decode.email;
    const doctorUser = await User.findOne({ email: doctorEmail });
    if (!doctorUser) {
      return res.status(404).json({ error: "Doctor Not Found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    doctorUser.password = hashedPassword;
    await doctorUser.save();
    res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    console.error("Error Resseting Password", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const signupDoctor = async (req, res) => {
  try {
    const { fullName, password, email } = req.body;
    const existedDoctor = await User.findOne({ email });
    if (existedDoctor) {
      return res.status(400).json({ message: "Email Already Existed" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password Must Be: Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      password: hashedPassword,
      role: "doctor",
      email,
    });
    await newUser.save();
    res.status(201).json({
      message: "account created successfully.",
      newUser,
    });
  } catch (error) {
    console.error("Error signing up doctor", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const compeleteDoctorProfile = async (req, res) => {
  try {
    const {
      name,
      age,
      email,
      gender,
      profileImage,
      phoneNumber,
      specialty,
      yearsOfExperience,
      availability,
      department,
      appointmentDuration,
      fees,
    } = req.body;
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user || user.role !== "doctor") {
      return res.status(404).json({ error: "Doctor not found." });
    }
    const existingProfile = await doctorModel.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({
        message:
          "Profile already exists. You can only complete this form once.",
      });
    }
    const foundDepartment = await departmentModel.findOne({ name: department });
    if (!foundDepartment) {
      return res
        .status(400)
        .json({ error: `Department '${department}' does not exist.` });
    }
    const ProfileImage = req.file ? req.file.filename : null;
    const newDoctor = new doctorModel({
      user: user._id,
      name,
      age,
      gender,
      profileImage: ProfileImage,
      phoneNumber,
      email: user.email,
      specialty,
      yearsOfExperience,
      availability: JSON.parse(availability),
      department: foundDepartment._id,
      appointmentDuration,
      fees,
    });

    await newDoctor.save();
    res.status(201).json({ message: "Doctor profile created successfully." });
  } catch (error) {
    console.error("Error Compeleting Doctor Data", error);
    res.status(500).json("Internal Server Error");
  }
};

const UpdateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      name,
      age,
      gender,
      phoneNumber,
      email,
      specialty,
      yearsOfExperience,
      availability,
      department,
      fees,
      appointmentDuration,
    } = req.body;

    let updateDepartment;
    if (department) {
      updateDepartment = await departmentModel.findOne({ name: department });
      if (!updateDepartment) {
        return res
          .status(404)
          .json({ error: `Department: ${department} Not Found` });
      }
    }

    let updatedProfileImage;
    if (req.file) {
      updatedProfileImage = req.file.filename;
    }

    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    if (email) {
      const existingDoctor = await doctorModel.findOne({ email });
      if (existingDoctor && existingDoctor._id.toString() !== id) {
        return res.status(400).json({ error: "Email already exists." });
      }
    }

    const doctor = await doctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor doesn't exist." });
    }

    if (doctor.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this profile." });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (age) updateFields.age = age;
    if (gender) updateFields.gender = gender;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;
    if (email) updateFields.email = email;
    if (specialty) updateFields.specialty = specialty;
    if (yearsOfExperience) updateFields.yearsOfExperience = yearsOfExperience;
    if (availability) updateFields.availability = availability;
    if (updateDepartment) updateFields.department = updateDepartment._id;
    if (fees) updateFields.fees = fees;
    if (appointmentDuration)
      updateFields.appointmentDuration = appointmentDuration;
    if (req.file) updateFields.ProfileImage = updatedProfileImage; // Use the updatedProfileImage variable

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res
      .status(200)
      .json({ message: "Doctor updated successfully", doctor: updatedDoctor });
  } catch (error) {
    console.error("Error Updating Doctor", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const doctor = await doctorModel.findById(id);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }
    if (doctor.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this profile." });
    }

    await doctorModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Doctor was deleted successfully." });
  } catch (error) {
    console.error("Error Deleting Doctor", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getResetPassword,
  postResetPassword,
  signupDoctor,
  compeleteDoctorProfile,
  UpdateDoctor,
  DeleteDoctor,
};