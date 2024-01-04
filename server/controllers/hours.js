const Attendance = require("../models/attendance");
const User = require("../models/user");

// CREATE ATTENDANCE
const createAttendance = async (req, res) => {
  try {
    const { date, status } = req.body;
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is not there" });
    }

    const inputDate = new Date(date);

    // Ensure the date is in the correct format
    const formattedDate = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const dayOfWeek = formattedDate.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(400).json({ error: "Attendance cannot be recorded on weekends" });
    }

    // Check if attendance entry already exists for the given user and date
    const existingAttendance = await Attendance.findOne({ user: userId, date: formattedDate });

    if (existingAttendance) {
      // If entry exists, update the status
      existingAttendance.status = status;
      await existingAttendance.save();

      return res.status(200).json({ message: "Attendance record overwritten successfully", attendance: existingAttendance });
    } else {
      // If entry doesn't exist, create a new attendance record
      const attendance = new Attendance({
        user: userId,
        date: formattedDate,
        status,
      });

      await attendance.save();

      return res.status(201).json({ message: "Attendance record created successfully", attendance });
    }
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

// ATTENDANCE FUNCTION
const calculateAttendance = async (user) => {
  try {
    const userId = user._id;
    const fromDate = user.joiningDate;
    const toDate = new Date();

    // Fetching additional user information
    const formattedProbationEndDate = user.probationEndDate ? new Date(user.probationEndDate) : null;

    // Fetching attendance records for the user within the date range
    const attendanceRecords = await Attendance.find({ user: userId, date: { $gte: fromDate, $lte: toDate } });

    // Create an array of all dates between joiningDate and toDate
    const allDates = [];
    let currentDate = new Date(fromDate);

    while (currentDate <= toDate) {
      allDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Check if each date has an attendance record, if not, add a default record
    allDates.forEach((date) => {
      const existingRecord = attendanceRecords.find((record) => record.date.toDateString() === date.toDateString());

      if (!existingRecord) {
        // Check if a default record already exists for the current date
        const defaultRecordExists = attendanceRecords.some(
          (record) => record.date.toDateString() === date.toDateString() && record.status === 'absent'
        );

        if (!defaultRecordExists) {
          attendanceRecords.push({
            user: userId,
            date: date,
            status: 'present', // Default status for missing dates
          });
        }
      }
    });

    let daysPresent = 0;
    let daysAbsent = 0;
    let daysSick = 0;
    let daysCasual = 0;
    let daysPto = 0;
    let daysHalfday = 0;

    attendanceRecords.forEach((record) => {
      const dayOfWeek = record.date.getDay();

      // Ignore weekends (Saturday - day 6, Sunday - day 0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        switch (record.status) {
          case 'present':
            daysPresent++;
            break;
          case 'absent':
            daysAbsent++;
            break;
          case 'sick':
            daysSick++;
            break;
          case 'casual':
            daysCasual++;
            break;
          case 'pto':
            daysPto++;
            break;
          case 'halfday':
            daysHalfday++;
            break;
        }
      }
    });

    return {
      _id: user._id,
      name: user.name,
      designation: user.designation,
      joiningDate: user.joiningDate,
      probationEndDate: formattedProbationEndDate,
      userId,
      daysPresent,
      daysAbsent,
      daysSick,
      daysCasual,
      daysPto,
      daysHalfday,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error calculating attendance");
  }
};




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

const deleteAllAttendanceEntries = async () => {
  try {
    // Assuming Attendance is your Mongoose model
    const result = await Attendance.deleteMany({});
    console.log(`Deleted ${result.deletedCount} attendance entries.`);
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting attendance entries");
  }
};

module.exports = {
  createAttendance,
  getDayAttendance,
  fetchAllUsersAttendance,
  deleteAllAttendanceEntries
};
