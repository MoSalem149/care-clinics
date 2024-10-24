const express = require("express");
const passport = require("passport");
const router = express.Router();
const { generateToken } = require("../Tools/GeneratePassword");
require("../OAuth/FaceBook");
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    const { _id: userId, role } = req.user;
    const token = generateToken({ userId, role });
    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect("http://localhost:5173/signup");
  }
);
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid", { path: "/" });
    return res.status(200).json({ message: "Logged out successfully" });
  });
});

module.exports = router;
