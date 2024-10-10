const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "password is too short"],
    },
    role: {
      type: String,
      enum: ["user", "doctor", "admin"],
      default: "user",
    },
    createdBy: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
