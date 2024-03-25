const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    state: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['casual', 'sick', 'pto', 'halfday', 'absent'],
      default: null,
    },
    attendance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attendance',
    },
    message: {
      type: String,
    },
    approvedby: {
      type: String,
    },
    workingDays: {
      type: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;
