const express = require("express");
const passport = require("passport");
const { generateToken } = require("../Tools/GeneratePassword");
const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
  maxAge: 24 * 60 * 60 * 1000,
};
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    const { role, userId } = req.user;
    const token = generateToken({ userId, role });
    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect(`http://localhost:5173/signup`);
  }
);

module.exports = router;
