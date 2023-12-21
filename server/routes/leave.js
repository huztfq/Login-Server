const express = require("express");
const { createSickLeave, getLeaveRequestsForAdmin, approveLeaveRequestByAdmin, getUserLeaveRequests } = require("../controllers/leave");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/createLeave/:userId", authMiddleware.authenticateToken, createSickLeave);
router.get("/leaveRequestsForAdmin", authMiddleware.authenticateToken, getLeaveRequestsForAdmin);
router.get("/leaveRequests/:userId", authMiddleware.authenticateToken, getUserLeaveRequests); 
router.post("/approveLeaveRequestByAdmin", authMiddleware.authenticateToken, approveLeaveRequestByAdmin);

module.exports = router;
