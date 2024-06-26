const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },
    joiningDate: {
      type: Date,
    },
    designation: {
      type: String
    },
    otp: String,
    otpExpires: Date
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;