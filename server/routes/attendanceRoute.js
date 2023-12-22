const express = require("express");
const {createAttendance, getDayAttendance, fetchAllUsersAttendance,} = require("../controllers/hours");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// ROUTES FOR DATA ENTRY
router.post("/createAtt/:userId", createAttendance);

// ROUTES FOR FETCHING SINGLE DATA
router.get("/getAtt/:id", getDayAttendance);

// ROUTES FOR FETCHING MULTIPLE ENTRIES
router.get("/allAtt", fetchAllUsersAttendance);

module.exports = router;
