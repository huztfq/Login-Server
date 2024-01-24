const express = require("express");
const { handleUserSignup, handleUserLogin, handleUserResetPassword, handleInfo, handleDeleteEmployees, handleFetchEmployeeDetails, handleUpdateEmployeeDetails, handleDeleteEmployee, handleForgotPassword, handleVerifyOTP,} = require("../controllers/user");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// ROUTES FOR AUTHORZATION AND AUTHENTICATION
router.post("/signup", authMiddleware.authenticateToken, handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/reset", authMiddleware.authenticateToken, handleUserResetPassword);
router.get("/info", handleInfo);
router.post("/deleteEmployees/:userId",authMiddleware.authenticateToken, handleDeleteEmployees);
router.get("/fetchEmployeeDetails/:userId", authMiddleware.authenticateToken, handleFetchEmployeeDetails);
router.post("/updateEmployeeDetails/:userId", authMiddleware.authenticateToken, handleUpdateEmployeeDetails);
router.post("/deleteEmployee/:userId", authMiddleware.authenticateToken, handleDeleteEmployee);
router.post("/forgotPassword", handleForgotPassword);
router.post("/verifyOTP", handleVerifyOTP);


module.exports = router;
