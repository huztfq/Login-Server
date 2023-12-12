const express = require("express");
const {createAttendance, getDayAttendance} = require("../controllers/hours");
const authMiddleware = require("../middlewares/auth");

//TODO: follow correct naming convention.
const router02 = express.Router();

// ROUTES FOR DATA ENTRY
router02.post("/attendance", authMiddleware.authenticateToken, createAttendance); //NOT TESTED

// ROUTES FOR FETCHING DATA
router02.get("/attendance", authMiddleware.authenticateToken, getDayAttendance); // NOT TESTED

module.exports = router02;