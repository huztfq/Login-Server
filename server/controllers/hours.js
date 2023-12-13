const Attendance = require("../models/attendance");
const User = require("../models/user");

// CALCULATIONS FOR ATTENDANCE
const calculateAttendance = async (user) => {
  const totalDaysPresent = await Attendance.countDocuments({
    user: user._id,
    status: "present",
  });
  const totalDaysAbsent = await Attendance.countDocuments({
    user: user._id,
    status: "absent",
  });

  const totalWorkingHours = totalDaysPresent * 8;

  const earnedVacationPerHour = 0.038;
  const ptoEarned = totalWorkingHours * earnedVacationPerHour;

  return {
    id: user._id,
    name: user.name,
    joiningDate: user.createdAt,
    totalDaysPresent,
    totalDaysAbsent,
    designation: user.designation,
    role: user.role,
    ptoRemaining: Math.floor(ptoEarned),
  };
};

// CREATE ATTENDANCE
const createAttendance = async (req, res) => {
  try {
    const { date, status, leaveType, workLocation } = req.body;
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const attendance = new Attendance({
      user: userId,
      date,
      status,
      leaveType,
      workLocation,
    });

    await attendance.save();
    return res
      .status(201)
      .json({ message: "Attendance record created successfully", attendance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Attendance Per Day
const getDayAttendance = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userAttendace = await calculateAttendance(user);

    return res.status(200).json({ userAttendace });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET Total Attendance

const fetchAllUsersAttendance = async (req, res) => {
  try {
    const allUsers = await User.find();
    const userPromises = allUsers.map(async (user) => {
      let newUser = await calculateAttendance(user);
      return newUser;
    });

    const userArray = (await Promise.all(userPromises)).filter(user => user.role != "admin");
    res.status(200).json({ success: true, data: userArray });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  createAttendance,
  getDayAttendance,
  fetchAllUsersAttendance,
};
