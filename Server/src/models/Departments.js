const mongoose = require("mongoose");
const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String },
  bio: { type: String },
});

const departmentModel = mongoose.model(
  "Department",
  departmentSchema,
  "Department"
);

module.exports = departmentModel;
       