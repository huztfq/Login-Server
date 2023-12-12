// router/user.js
const express = require("express");
const { handleUserSignup, handleUserLogin, handleUserResetPassword, handleUserForgotPassword, handleUserLogout, handleInfo  } = require("../controllers/user");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// ROUTES FOR AUTHORZATION AND AUTHENTICATION

router.post("/signup", handleUserSignup);  //TESTED
router.post("/login", handleUserLogin);  // TESTED
router.post("/reset", authMiddleware.authenticateToken, handleUserResetPassword); //TESTED
router.post("/forgot", authMiddleware.authenticateToken, handleUserForgotPassword); // NOT TESTED
router.post("/logout", authMiddleware.authenticateToken, handleUserLogout); //TESTED
router.get("/info", handleInfo); // TESTED

module.exports = router;
