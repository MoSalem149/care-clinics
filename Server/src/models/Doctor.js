const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String },
  age: { type: Number },
  gender: { type: String },
  ProfileImage: { type: String },
  phoneNumber: { type: String },
  specialty: { type: String },
  yearsOfExperience: { type: Number },
  availability: [
    {
      day: { type: String },
      startTime: { type: String },
      endTime: { type: String },
    },
  ],
  appointments: [
    {
      appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
      appointmentTime: {
        type: Date,
      },
      appointmentDuration: {
        type: Number,
        default: 30,
      },
      appointmentEndTime: { type: Date },
    },
  ],
  fees: {
    consultation: { type: Number },
  },
  isApproved: { type: Boolean, default: false },
  bio: { type: String },
});

const doctorModel = mongoose.model("Doctor", doctorSchema, "Doctor");

module.exports = doctorModel;
