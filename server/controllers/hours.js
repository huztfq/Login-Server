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
    userId: user._id,
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

// CREATE LEAVE
const createLeave = async (req, res) => {
  try {
    const { date, leaveType } = req.body;
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!['sick', 'casual', 'other'].includes(leaveType)) {
      return res.status(400).json({ error: "Invalid leave type" });
    }

    const leaveRecord = new Attendance({
      user: userId,
      date,
      status: 'leave', 
      leaveType,
    });

    await leaveRecord.save();
    return res
      .status(201)
      .json({ message: "Leave record created successfully", leaveRecord });
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

    res.status(200).json({ success: true, data: userAttendace });
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

// Automate Attendance
const getAttendance = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const today = new Date();
    const joinDate = new Date(user.joiningDate);

    const workingDaysArray = getWorkingDaysArray(joinDate, today);

    const existingAttendance = await Attendance.find({
      user: userId,
      date: { $gte: joinDate, $lte: today },
    });

    const existingDates = existingAttendance.map((record) => record.date.toISOString());

    const missingDates = workingDaysArray.filter(
      (date) => !existingDates.includes(date.toISOString())
    );

    const missingAttendance = missingDates.map((date) => ({
      user: userId,
      date,
      status: 'present',
    }));

    await Attendance.insertMany(missingAttendance);

    const userAttendance = await Attendance.find({
      user: userId,
      date: { $gte: joinDate, $lte: today },
    });

    let daysPresent = 0;
    let daysAbsent = 0;
    let sickLeaves = 0;
    let casualLeaves = 0;

    userAttendance.forEach((attendance) => {
      if (attendance.status === 'present') {
        daysPresent++;
      } else if (attendance.status === 'absent') {
        daysAbsent++;
      }

      if (attendance.leaveType === 'sick') {
        sickLeaves++;
      } else if (attendance.leaveType === 'casual') {
        casualLeaves++;
      }
    });

    const attendanceSummary = {
      _id: userId,
      name: user.name,
      daysPresent,
      daysAbsent,
      sickLeaves,
      casualLeaves,
    };

    res.status(200).json({ success: true, data: attendanceSummary });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

function getWorkingDaysArray(startDate, endDate) {
  const workingDaysArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDaysArray.push(new Date(currentDate));
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workingDaysArray;
}

module.exports = {
  createLeave,
  createAttendance,
  getDayAttendance,
  fetchAllUsersAttendance,
  getAttendance,
};
