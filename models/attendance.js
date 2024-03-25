const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'halfday', 'pto', 'casual', 'sick'],
      default: 'present',
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
