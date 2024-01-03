const express = require("express");
const {createAttendance, getDayAttendance, fetchAllUsersAttendance, deleteAllAttendanceEntries} = require("../controllers/hours");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// ROUTES FOR DATA ENTRY
router.post("/createAtt/:userId",authMiddleware.authenticateToken, createAttendance);

// ROUTES FOR FETCHING SINGLE DATA
router.get("/getAtt/:id",authMiddleware.authenticateToken, getDayAttendance);

// ROUTES FOR FETCHING MULTIPLE ENTRIES
router.get("/allAtt",authMiddleware.authenticateToken, fetchAllUsersAttendance);

// ROUTES FOR DELETING ALL ENTRIES
router.delete("/deleteAtt",authMiddleware.authenticateToken, deleteAllAttendanceEntries);

module.exports = router;
