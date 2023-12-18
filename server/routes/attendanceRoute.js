const express = require("express");
const {createAttendance, getDayAttendance, fetchAllUsersAttendance, createLeave, getAttendance} = require("../controllers/hours");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// ROUTES FOR DATA ENTRY
router.post("/createAtt/:userId", authMiddleware.authenticateToken, createAttendance);
router.post("/createLeave/:id", authMiddleware.authenticateToken, createLeave);

// ROUTES FOR FETCHING SINGLE DATA
router.get("/getAtt/:id", authMiddleware.authenticateToken, getDayAttendance);

// ROUTES FOR FETCHING MULTIPLE ENTRIES
router.get("/allAtt", authMiddleware.authenticateToken, fetchAllUsersAttendance);

// NEW ROUTES FOR FETCHING
// SINGLE ENTRY
router.get("/getAttendance/:id", authMiddleware.authenticateToken, getAttendance); 

module.exports = router;