const Attendance = require("../models/attendance");
const User = require("../models/user");

// CREATE ATTENDANCE
const createAttendance = async (req, res) => {
  try {
    const { date, status, leaveType, workLocation } = req.body;
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is not there" });
    }

    const inputDate = new Date(date);
    const dayOfWeek = inputDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(400).json({ error: "Attendance cannot be recorded on weekends" });
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

// Get Attendance Per User
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

    const userAttendance = await calculateAttendance(user);

    res.status(200).json({ success: true, data: userAttendance });
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

    const userArray = (await Promise.all(userPromises)).filter(user => user.role !== "admin");
    res.status(200).json({ success: true, data: userArray });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

async function calculateAttendance(user) {
  let today = new Date();
  const joinDate = new Date(user.joiningDate);

  const probationEndDate = new Date(joinDate);
  probationEndDate.setMonth(joinDate.getMonth() + 3);

  const workingDaysArray = getWorkingDaysArray(joinDate, today);

  const existingAttendance = await Attendance.find({
    user: user._id,
    date: { $gte: joinDate, $lte: today },
  });

  const existingDates = existingAttendance.map((record) =>
    record.date.toISOString()
  );

  const missingDates = workingDaysArray.filter(
    (date) => !existingDates.includes(date.toISOString())
  );

  const missingAttendance = missingDates.map((date) => ({
    user: user._id,
    date,
    status: 'present',
  }));

  await Attendance.insertMany(missingAttendance);

  const userAttendance = await Attendance.find({
    user: user._id,
    date: { $gte: joinDate, $lte: today },
  });

  let daysPresent = 0;
  let daysAbsent = 0;
  let sickLeaves = 0;
  let casualLeaves = 0;
  let halfDays = 0;
  let remainingPTO = 0;

  const totalPTODays = 15;
  const elapsedMonths = Math.max(
    0,
    today.getMonth() - probationEndDate.getMonth() + 12 * (today.getFullYear() - probationEndDate.getFullYear())
  );
  const ptoDaysAllowed = totalPTODays / 12;
  remainingPTO = Math.max(0, ptoDaysAllowed * elapsedMonths);
  let paidOff = remainingPTO;  

  userAttendance.forEach((attendance) => {
    if (attendance.status === 'present' && !attendance.leaveType) {
      daysPresent += 1; 
    } else if (attendance.status === 'absent') {
      daysAbsent += 1;
    } else if (attendance.status === 'halfday') {
      daysPresent += 0.5; 
      halfDays += 1;
    }

    if (attendance.leaveType === 'sick') {
      sickLeaves += 1;
    } else if (attendance.leaveType === 'casual') {
      casualLeaves += 1;
    }
    if (attendance.status === 'PTO' || attendance.status === 'pto') {
       paidOff -= 1; 
    }
  });

  const formattedProbationEndDate = `${probationEndDate.getDate()} ${getMonthName(
    probationEndDate.getMonth()
  )} ${probationEndDate.getFullYear()}`;

  const attendanceSummary = {
    _id: user._id,
    name: user.name,
    designation: user.designation,
    joiningDate: user.joiningDate,
    probationEndDate: formattedProbationEndDate,
    daysPresent,
    daysAbsent,
    sickLeaves,
    casualLeaves,
    halfDays,
    paidOff,
  };

  return attendanceSummary;
}

function getMonthName(month) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[month];
}

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
  createAttendance,
  getDayAttendance,
  fetchAllUsersAttendance
};
