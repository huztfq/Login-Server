// router/user.js
const express = require("express");
const { handleUserSignup, handleUserLogin, handleUserResetPassword, handleUserForgotPassword, handleUserLogout  } = require("../controllers/user"); 
const {createAttendance, getDayAttendance} = require("../controllers/hours");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// ROUTES FOR AUTHORZATION AND AUTHENTICATION

router.post("/signup", handleUserSignup);  //TESTED
router.post("/login", handleUserLogin);  // TESTED
router.post("/reset", authMiddleware.authenticateToken, handleUserResetPassword); //TESTED
router.post("/forgot", authMiddleware.authenticateToken, handleUserForgotPassword); // NOT TESTED
router.post("/logout", authMiddleware.authenticateToken, handleUserLogout); //TESTED

// ROUTES FOR DATA ENTRY

router.post("/attendance", authMiddleware.authenticateToken, createAttendance); //NOT TESTED

// ROUTES FOR FETCHING DATA

router.get("/attendance", authMiddleware.authenticateToken, getDayAttendance); // NOT TESTED


module.exports = router;
