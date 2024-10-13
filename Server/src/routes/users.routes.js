const express = require("express");
const router = express.Router();
const userController = require('../Controller/user.controller');
const { verifyToken } = require('../middleWares/verifyToken');
const { body, validationResult } = require('express-validator');
const authMiddleware=require('../middleWares/authMiddleWare') 
const userProfile=require('../Controller/userProfile.controller')

router.route("/").get(verifyToken, userController.getAllUsers);

router
  .route("/register")
  .post(
    [
      body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters long"),
      body("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
      body("role")
        .optional()
        .isIn(["user", "doctor", "admin"])
        .withMessage("Invalid role"),
      body("createdBy")
        .optional()
        .isIn(["admin", "user"])
        .withMessage("Invalid createdBy value"),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      userController.register(req, res);
    }
  );

router
  .route("/login")
  .post(
    [
      body("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
      body("password").notEmpty().withMessage("Password is required"),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      userController.login(req, res);
    }
  );  
  router
  .route('/profile/add-info')
  .post(authMiddleware, userProfile.addProfileInfo);
  
  router
  .route('/profile/update')
  .put( authMiddleware, userProfile.updateUser)
  router
  .route('/profile/delete')
  .delete( authMiddleware, userProfile.deleteAccount)
  router
  .route('/profile/book/:doctorId')
  .post( authMiddleware, userProfile.bookAppointment)
  router
  .route('/profile/updateAppointment/:appointmentId')
  .put( authMiddleware, userProfile.updateAppointment)
  router
  .route('/profile/deleteAppointment/:appointmentId')
  .delete( authMiddleware, userProfile.deleteAppointment)
     


// router.post("/forgot-password", userController.ForgetPasswordForm);

// router.post("/reset-password", userController.ResetPassword);

module.exports = router;
  