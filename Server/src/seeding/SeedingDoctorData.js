const doctorModel = require("../models/Doctor");
const departmentModel = require("../models/Departments");
const doctorsData = require("../Data/Doctors/Doctors.json");

async function seedDoctors() {
  try {
    for (const doctor of doctorsData) {
      const department = await departmentModel.findOne({
        name: doctor.department,
      });

      if (!department) {
        // console.log(`Department not found for doctor: ${doctor.name}`);
        continue;
      }

      const existingDoctor = await doctorModel.findOne({
        name: doctor.name,
      });

      if (existingDoctor) {
        // console.log(`Doctor ${doctor.name} already exists. Skipping...`);
        continue;
      }

      const newDoctor = new doctorModel({
        ...doctor,
        department: department._id,
      });

      await newDoctor.save();
      // console.log(
      // `Doctor ${doctor.name} added to department ${department.name}`
      // );
    }
  } catch (error) {
    // console.error("Error seeding doctors:", error);
  }
}

module.exports = seedDoctors;
