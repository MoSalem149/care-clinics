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
    // console.error("Invalid Token", error);
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
    // console.error("Error Resseting Password", error);
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

    const { department, availability, profileImage, ...doctorDetails } =
      req.body;

    const foundDepartment = await departmentModel.findOne({ name: department });
    if (!foundDepartment) {
      return res
        .status(400)
        .json({ error: `Department '${department}' does not exist.` });
    }
    const ProfileImage = req.file;

    const newDoctor = new doctorModel({
      user: user._id,
      ...doctorDetails,
      profileImage: ProfileImage,
      availability: availability,
      department: foundDepartment._id,
    });

    await newDoctor.save();
    res.status(201).json({ message: "Doctor profile created successfully." });
  } catch (error) {
    console.error("Error completing Doctor Data", error);
    res.status(500).json("Internal Server Error");
  }
};

const UpdateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { department, availability, ...doctorDetails } = req.body;

    let updateDepartment;
    if (department) {
      updateDepartment = await departmentModel.findOne({ name: department });
      if (!updateDepartment) {
        return res
          .status(404)
          .json({ error: `Department: ${department} Not Found` });
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

    const updatedProfileImage = req.body.ProfileImage
      ? req.body.ProfileImage
      : doctor.ProfileImage;

    const updateFields = {
      ...doctorDetails,
      ...(updateDepartment && { department: updateDepartment._id }),
      ProfileImage: updatedProfileImage,
      ...(availability && { availability }),
    };

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
    // console.error("Error Updating Doctor", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteDoctor = async (req, res) => {
  try {
    const { id } = req.params; // Doctor ID
    const userId = req.user.id; // Authorized user's ID

    const doctor = await doctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    if (doctor.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this profile." });
    }

    // Delete the doctor profile
    await doctorModel.findByIdAndDelete(id);

    // Delete the associated user from the User collection
    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ message: "Doctor and user profile deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const allDoctors = await doctorModel.find();
    if (!allDoctors) {
      res.status(404).json({ message: "No Doctors Found" });
    }
    res.status(200).json(allDoctors);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getResetPassword,
  postResetPassword,
  signupDoctor,
  compeleteDoctorProfile,
  UpdateDoctor,
  DeleteDoctor,
  getAllDoctors,
};
