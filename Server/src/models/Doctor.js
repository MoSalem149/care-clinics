const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  ProfileImage: { type: String },
  phoneNumber: { type: String },
  email: { type: String, required: true },
  specialty: { type: String, required: true },
  yearsOfExperience: { type: Number },
  availability: [
    {
      day: { type: String },
      startTime: { type: Date },
      endTime: { type: Date },
    },
  ],
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  fees: {
    consultation: { type: Number },
  },
  appointmentDuration: { type: Number, default: 30 },
  isApproved: { type: Boolean, default: false },
});

const doctorModel = mongoose.model("Doctor", doctorSchema, "Doctor");

module.exports = doctorModel;
