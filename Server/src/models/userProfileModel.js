const mongoose = require('mongoose');

const userProfileSchema = mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true 
      },
    fullName: {
      type: String,
      trim: true,
      required: [true, "Full name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, "Gender is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: [true, "Blood type is required"],
    },
    chronicConditions: {
      type: [String], 
    },
    surgicalHistory: [
      {
        surgeryType: { type: String },
        surgeryDate: { type: Date },
      },
    ],
    familyMedicalHistory: {
      type: [String], 
    },
    lastCheckupDate: {
      type: Date,
    },
  },
  {
    timestamps: true, 
  }
);

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
  