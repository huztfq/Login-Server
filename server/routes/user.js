const express = require("express");
const { handleUserSignup, handleUserLogin, handleUserResetPassword, handleUserForgotPassword, handleUserLogout, handleInfo, handleDeleteEmployees} = require("../controllers/user");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// ROUTES FOR AUTHORZATION AND AUTHENTICATION
router.post("/signup", authMiddleware.authenticateToken, handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/reset", authMiddleware.authenticateToken, handleUserResetPassword);
router.post("/forgot", authMiddleware.authenticateToken, handleUserForgotPassword);
router.post("/logout", authMiddleware.authenticateToken, handleUserLogout);
router.get("/info", handleInfo);
router.post("/deleteEmployees/:userId", handleDeleteEmployees);

module.exports = router;
