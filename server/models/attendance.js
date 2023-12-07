const mongoose = require("mongoose");


const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: Date,
    status: {
      type: String,
      enum: ['present', 'absent'],
      default: 'present',
    },
    leaveType: {
      type: String,
      enum: ['casual', 'sick'],
      default: null,
    },
    workLocation: {
      type: String,
      enum: ['remote', 'onsite'],
      default: 'onsite',
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;