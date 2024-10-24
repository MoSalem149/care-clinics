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
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid", { path: "/" });
    res.clearCookie("token", { path: "/" });
    return res.status(200).json({ message: "Logged out successfully" });
  });
});

module.exports = router;
