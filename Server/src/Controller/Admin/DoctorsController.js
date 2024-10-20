const bcrypt = require("bcrypt");
const { models } = require("mongoose");
const DoctorModel = require("../../models/Doctor.js");
const departmentModel = require("../../models/Departments");
const User = require("../../models/userModel.js");
const { json } = require("express");
const { updateDepartment } = require("../Admin/DepartmentController.js");
const {
  generateAdvancedPassword,
  generateResetToken,
  generateToken,
} = require("../../Tools/GeneratePassword.js");
const sendResetPasswordEmail = require("../../Tools/SendEmailToDoctors.js");
const doctorModel = require("../../models/Doctor.js");

const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;

const GetAllDoctors = async (req, res) => {
  try {
    const getDoctors = await DoctorModel.find();
    const GetFullPath = getDoctors.map((doctor) => ({
      ...doctor.toObject(),
      ProfileImage: `${doctor.ProfileImage}`,
    }));
    res.status(201).json(GetFullPath);
  } catch (error) {
    // console.log("Error Fetching Doctors", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const GetOneDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const GetOneDoctor = await DoctorModel.findOne({ _id: id });
    if (!GetOneDoctor) {
      return res.status(404).json({ message: "Doctor Not Found" });
    }
    const GetFullPath = {
      ...GetOneDoctor.toObject(),
      ProfileImage: `/Images/${GetOneDoctor.ProfileImage}`,
    };
    res.status(200).json(GetFullPath);
  } catch (error) {
    // console.error("Error Fetching Doctor", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const CreateDoctor = async (req, res) => {
  try {
    const {
      email,
      fullName,
      name,
      ProfileImage = null,
      availability,
      fees,
      ...doctorDetails
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const foundDepartment = await departmentModel.findOne({
      name: doctorDetails.department,
    });
    if (!foundDepartment) {
      return res.status(400).json({
        error: `Department '${doctorDetails.department}' does not exist.`,
      });
    }

    const tempPassword = generateAdvancedPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: "doctor",
      createdBy: "admin",
    });
    await newUser.save();

    const newDoctor = new DoctorModel({
      name: fullName,
      ...doctorDetails,
      ProfileImage,
      availability:
        typeof availability === "string"
          ? JSON.parse(availability)
          : availability,
      department: foundDepartment._id,
      fees: typeof fees === "string" ? JSON.parse(fees) : fees,
      user: newUser._id,
      isApproved: true,
    });

    const saveDoctor = await newDoctor.save();

    const resetToken = generateToken({ email }, "24h");
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}?createdBy=${newUser.createdBy}`;

    await sendResetPasswordEmail({
      to: email,
      subject: "Welcome to the Clinic - Reset Your Password",
      html: `
        <p>Dear Dr. ${newDoctor.name},</p>
        <p>Welcome to our clinic! Please use the following link to reset your temporary password and set a new one:</p>
        <p><a href="${resetUrl}">Reset Your Password</a></p>
        <p>Best regards,<br>The Clinic Team</p>
      `,
    });

    res.status(201).json(saveDoctor);
  } catch (error) {
    // console.error("Error Creating Doctor", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const UpdateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      department,
      email,
      ProfileImage = null,
      availability,
      fees,
      ...doctorDetails
    } = req.body;

    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    if (email) {
      const existingDoctor = await DoctorModel.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({ error: "Email already exists." });
      }
    }

    const foundDepartment = department
      ? await departmentModel.findOne({ name: department })
      : null;
    if (department && !foundDepartment) {
      return res
        .status(404)
        .json({ error: `Department '${department}' not found.` });
    }

    const updateData = {
      ...doctorDetails,
      ProfileImage: req.body.ProfileImage || null,
      availability:
        typeof availability === "string"
          ? JSON.parse(availability)
          : availability,
      fees: typeof fees === "string" ? JSON.parse(fees) : fees,
      ...(foundDepartment ? { department: foundDepartment._id } : {}),
    };

    const updatedDoctor = await DoctorModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedDoctor) {
      return res.status(404).json({ error: "Doctor not found." });
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
    const { id } = req.params;
    const DeleteDoctor = await DoctorModel.findByIdAndDelete(id);
    if (!DeleteDoctor) {
      res.status(404).json({ message: "Doctor Not Found" });
    }
    res.status(201).json({ message: "Doctor Was Deleted Suceessfuly" });
  } catch (error) {
    // console.error("Error Creating Doctor", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const approveDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    const doctor = await doctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    if (doctor.isApproved) {
      return res.json({ message: "Doctor is already approved" });
    }
    doctor.isApproved = true;
    await doctor.save();
    return res.status(201).json({ message: "Doctor approved successfully" });
  } catch (error) {
    // console.error("Error Approving Doctor: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  GetAllDoctors,
  GetOneDoctor,
  CreateDoctor,
  UpdateDoctor,
  DeleteDoctor,
  approveDoctor,
};
