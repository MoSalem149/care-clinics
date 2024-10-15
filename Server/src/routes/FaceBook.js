const express = require("express");
const passport = require("passport");
const router = express.Router();
const { generateToken } = require("../Tools/GeneratePassword");
require("../OAuth/FaceBook");
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    const token = generateToken({ userId: req.user._id });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect("http://localhost:5173/signup");
  }  
);
module.exports = router;
