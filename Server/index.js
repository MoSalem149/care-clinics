const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
const doctorModel = require("./src/models/Doctor");
const Images = require("./src/routes/Images");
const seedDoctors = require("./src/seeding/SeedingDoctorData");
const seedDepartments = require("./src/seeding/SeedingDepartments");
const Departments = require("./src/routes/Admin/Deaprtments");
const Doctors = require("./src/routes/Admin/Doctors");
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/images", Images);
app.use("/departments", Departments);
app.use("/doctors", Doctors);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await seedDepartments();
    await seedDoctors();

    app.listen(PORT, () => {
      console.log(`Server Is Running On Port: ${PORT}`);
    });
  })
  .catch((err) => console.log("Failed To connect to MongoDB:", err));
