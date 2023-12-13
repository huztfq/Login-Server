const express = require("express");
const {createAttendance, getDayAttendance, fetchAllUsersAttendance} = require("../controllers/hours");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// ROUTES FOR DATA ENTRY
router.post("/createAtt/:id", authMiddleware.authenticateToken, createAttendance); //NOT TESTED

// ROUTES FOR FETCHING SINGLE DATA
router.get("/getAtt/:id", authMiddleware.authenticateToken, getDayAttendance); // NOT TESTED

// ROUTES FOR FETCHING MULTIPLE ENTRIES
router.get("/allAtt", authMiddleware.authenticateToken, fetchAllUsersAttendance); // NOT TESTED
module.exports = router;