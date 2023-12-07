// router/user.js
const express = require("express");
const { handleUserSignup, handleUserLogin, handleUserResetPassword, handleUserForgotPassword, handleUserLogout  } = require("../controllers/user"); 
const {createAttendance, getDayAttendance} = require("../controllers/hours");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// ROUTES FOR AUTHORZATION AND AUTHENTICATION

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/reset", authMiddleware.authenticateToken, handleUserResetPassword);
router.post("/forgot", authMiddleware.authenticateToken, handleUserForgotPassword);
router.post("/logout", authMiddleware.authenticateToken, handleUserLogout);

// ROUTES FOR DATA ENTRY

router.post("/attendance", authMiddleware.authenticateToken, createAttendance);

// ROUTES FOR FETCHING DATA

router.get("/attendance", authMiddleware.authenticateToken, getDayAttendance);


module.exports = router;
