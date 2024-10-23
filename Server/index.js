const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const doctorModel = require("./src/models/Doctor");
const Images = require("./src/routes/Images");
const seedDoctors = require("./src/seeding/SeedingDoctorData");
const seedDepartments = require("./src/seeding/SeedingDepartments");
const Departments = require("./src/routes/Admin/Departments");
const DoctorsByAdmin = require("./src/routes/Admin/Doctors");
const Doctors = require("./src/routes/Doctors/Doctors");
const userRouter = require("./src/routes/users.routes");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const OAUTH = require("./src/routes/OAUTH");
const FaceBook = require("./src/routes/FaceBook");
const Appointments = require("./src/routes/Admin/AppointmentsRoute");
const Users = require("./src/routes/Admin/Users");
require("./src/OAuth/OAuthConfig");
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/images", Images);
app.use("/Admin/departments", Departments);
app.use("/Admin/doctors", DoctorsByAdmin);
app.use("/Admin", Appointments);
app.use("/Admin", Users);
app.use("/doctors", Doctors);
app.use("/users", userRouter);
app.use("/auth", OAUTH);
app.use("/auth", FaceBook);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await seedDepartments();

    app.listen(PORT, () => {
      console.log(`Server Is Running On Port: ${PORT}`);
    });
  })
  .catch((err) => console.log("Failed To connect to MongoDB:", err));
