const express = require("express");
const { handleUserSignup, handleUserLogin, handleUserResetPassword, handleUserForgotPassword, handleUserLogout, handleInfo, handleDeleteEmployees, handleFetchEmployeeDetails, handleUpdateEmployeeDetails, handleDeleteEmployee} = require("../controllers/user");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// ROUTES FOR AUTHORZATION AND AUTHENTICATION
router.post("/signup", authMiddleware.authenticateToken, handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/reset", authMiddleware.authenticateToken, handleUserResetPassword);
router.post("/forgot", authMiddleware.authenticateToken, handleUserForgotPassword);
router.post("/logout", authMiddleware.authenticateToken, handleUserLogout);
router.get("/info", handleInfo);
router.post("/deleteEmployees/:userId",authMiddleware.authenticateToken, handleDeleteEmployees);
router.get("/fetchEmployeeDetails/:userId", authMiddleware.authenticateToken, handleFetchEmployeeDetails);
router.post("/updateEmployeeDetails/:userId", authMiddleware.authenticateToken, handleUpdateEmployeeDetails);
router.post("/deleteEmployee/:userId",authMiddleware.authenticateToken, handleDeleteEmployee);

module.exports = router;
