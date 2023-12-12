const express = require("express");
const {createAttendance, getDayAttendance} = require("../controllers/hours");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// ROUTES FOR DATA ENTRY
router.post("/", authMiddleware.authenticateToken, createAttendance); //NOT TESTED

// ROUTES FOR FETCHING DATA
router.get("/", authMiddleware.authenticateToken, getDayAttendance); // NOT TESTED

module.exports = router;