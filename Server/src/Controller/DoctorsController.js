const { models } = require("mongoose");
const DoctorModel = require("../models/Doctor");
const departmentModel = require("../models/Departments");
const { json } = require("express");
const { updateDepartment } = require("./Admin/DepartmentController.js");

const GetAllDoctors = async (req, res) => {
  try {
    const getDoctors = await DoctorModel.find();
    const GetFullPath = getDoctors.map((doctor) => ({
      ...doctor.toObject(),
      ProfileImage: `/Images/${doctor.ProfileImage}`,
    }));
    res.status(201).json(GetFullPath);
  } catch (error) {
    console.log("Error Fetching Doctors", error);
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
    console.error("Error Fetching Doctor", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const CreateDoctor = async (req, res) => {
  try {
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
    const foundDepartment = await departmentModel.findOne({ name: department });
    if (!foundDepartment) {
      return res
        .status(400)
        .json({ error: `Department '${department}' does not exist.` });
    }
    const ProfileImage = req.file ? req.file.filename : null;
    const newDoctor = new DoctorModel({
      name,
      age,
      gender,
      ProfileImage,
      phoneNumber,
      email,
      specialty,
      yearsOfExperience,
      availability: JSON.parse(availability),
      department: foundDepartment._id,
      fees: JSON.parse(fees),
      appointmentDuration,
    });
    const saveDoctor = await newDoctor.save();
    res.status(201).json(saveDoctor);
  } catch (error) {
    console.error("Error Creating Doctor", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const UpdateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
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

    const UpdateDoctor = await DoctorModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          age,
          gender,
          phoneNumber,
          email,
          specialty,
          yearsOfExperience,
          availability,
          department: updateDepartment ? updateDepartment._id : undefined,
          fees,
          appointmentDuration,
          ProfileImage: updatedProfileImage,
        },
      },
      { new: true, runValidators: true }
    );
    if (!UpdateDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res
      .status(200)
      .json({ message: "Doctor updated successfully", doctor: UpdateDoctor });
  } catch (error) {
    console.error("Error Creating Doctor", error);
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
    console.error("Error Creating Doctor", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  GetAllDoctors,
  GetOneDoctor,
  CreateDoctor,
  UpdateDoctor,
  DeleteDoctor,
};
