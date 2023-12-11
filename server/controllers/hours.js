const Attendance = require("../models/attendance");

const createAttendance = async (req, res) => {
  try {
    const { date, status, leaveType} = req.body;
    const userId = req.params.userId; 

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const attendance = new Attendance({
      user: userId,
      date,
      status,
      leaveType,
    });

    await attendance.save();

    return res.status(201).json({ message: 'Attendance record created successfully', attendance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getDayAttendance = async (req, res) => {
  try {
    const { userId } = req.params; 
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    const user = await User.findById(userId);
  
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    const totalDaysPresent = await Attendance.countDocuments({ user: userId, status: 'present' });
    const totalDaysAbsent = await Attendance.countDocuments({ user: userId, status: 'absent' });
  
    const totalWorkingHours = totalDaysPresent * 8;
  
    const earnedVacationPerHour = 0.038;
    const ptoEarned = totalWorkingHours * earnedVacationPerHour;
  
    const dayAttendance = {
      name: user.name,
      joiningDate: user.createdAt,
      totalDaysPresent,
      totalDaysAbsent,
      designation: user.role,
      ptoRemaining: Math.floor(ptoEarned),
    };
  
    return res.status(200).json({ dayAttendance });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = getDayAttendance;
  
  
  module.exports = { createAttendance, getDayAttendance };