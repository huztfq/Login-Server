const express = require("express");
const {createAttendance, getDayAttendance, fetchAllUsersAttendance, createLeave} = require("../controllers/hours");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// ROUTES FOR DATA ENTRY
router.post("/createAtt/:id", authMiddleware.authenticateToken, createAttendance); // TESTED
router.post("/createLeave/:id", authMiddleware.authenticateToken, createLeave); // Tested
// ROUTES FOR FETCHING SINGLE DATA
router.get("/getAtt/:id", authMiddleware.authenticateToken, getDayAttendance); //  TESTED

// ROUTES FOR FETCHING MULTIPLE ENTRIES
router.get("/allAtt", authMiddleware.authenticateToken, fetchAllUsersAttendance); //  TESTED

module.exports = router;