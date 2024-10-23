const httpstatus = require("./utilities/httpStatusText");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const departmentModel = require("../models/Departments");
require(`dotenv`).config();

const getAllUsers = async (req, res) => {
  try {
    const query = req.query;
    const limit = query.limit;
    const page = query.page;
    const skip = (page - 1) * limit;
    const users = await User.find({}, { __v: false, password: false })
      .limit(limit)
      .skip(skip);

    if (!users || users.length === 0) {
      return res.json({
        status: httpstatus.FAIL,
        data: { course: "course not found" },
      });
    }
    res.json({ status: httpstatus.SUCCESS, data: { users } });
    // console.log(req.headers);
  } catch (error) {
    res
      .status(500)
      .json({ status: httpstatus.ERROR, data: null, message: error.message });
  }
};

const register = async (req, res) => {
  const { fullName, email, password, role } = req.body; 

  if (!password) {
    return res
      .status(400)
      .json({ status: "error", message: "Password is required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    // Generate token after creating user
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5d" }
    );

    newUser.token = token; 

    await newUser.save();

    res.status(201).json({
      status: "success",
      data: {
        fullName: newUser.fullName,
        email: newUser.email,
        token: newUser.token, 
      },
      message: "Registration successful",
    });
  } catch (error) {
    // console.error("Registration error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.json({
        status: httpstatus.FAIL,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: httpstatus.FAIL, message: "User not found" });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);
    if (matchedPassword) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "5d" }
      );
      user.token = token;

      return res.json({
        status: httpstatus.SUCCESS,
        message: "User logged in successfully",
        token,
      });
    } else {
      return res.json({
        status: httpstatus.FAIL,
        message: "Incorrect email or password",
      });
    }
  } catch (err) {
    return next({ status: httpstatus.ERROR, message: "An error occurred" });
  }
}; 

const ForgetPasswordForm = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    const role = user.role === "doctor" ? "Doctor" : "Patient";
    const createdBy = user.createdBy;
    const resetLink = `http://localhost:5173/reset-password/${token}?createdBy=${createdBy}`;
    const emailDetails = {
      to: email,
      subject: "Password Reset Request",
      html: `<p>Dear ${role},</p>
        <p>We have received a request to reset the password associated with your account at Clinic.</p>
        <p>If you did not request a password reset, please ignore this email. Otherwise, you can reset your password by clicking the link below:</p>
        <p><a href="${resetLink}">Reset Your Password</a></p>
        <p>For your security, this link will expire in 1 hour.</p>
        <p>If you have any questions or need further assistance, please feel free to contact our support team.</p>
        <p>Thank you,<br/>
        Clinic Support Team</p>
        <p><em>This is an automated message, please do not reply.</em></p>`,
    };
    await sendResetPasswordEmail(emailDetails);
    res
      .status(201)
      .json({ message: "Password reset link has been sent to your email" });
  } catch (error) {
    // console.error("Error in forgot-password route", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const authorHeader = req.headers["authorization"];
    if (!authorHeader || !authorHeader.startsWith("Bearer ")) {
      return res
        .status(400)
        .json({ error: "Authorization token is missing or invalid." });
    }

    const token = authorHeader.split(" ")[1];
 
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required." });
    } 

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least eight characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) { 
      return res.status(404).json({ error: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    // console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const GetDepartments = async (req, res) => {
  try {
    const GetDepartments = await departmentModel.find();
    const ImageFullPath = GetDepartments.map((department) => ({
      ...department.toObject(),
      image: department.image,
    }));

    if (!GetDepartments) {
      res.status(404).json({ message: "Department Not Found" });
    }

    res.status(201).json(ImageFullPath);
  } catch (error) {
    // console.error("Error Featching Departmnet", error);
    res.status(500).json({ message: "Internal Server Errror" });
  }
};

module.exports = {
  getAllUsers,
  register,
  login,
  ForgetPasswordForm,
  ResetPassword,
  GetDepartments,
};
