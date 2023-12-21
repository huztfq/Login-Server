const Leave = require('../models/leave');
const User = require('../models/user');
const Attendance = require('../models/attendance');
const jwt = require('jsonwebtoken');

const createSickLeave = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, leaveType } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingLeave = await Leave.findOne({
      user: userId,
      status: 'pending',
    });

    if (existingLeave) {
      return res.status(400).json({ message: 'Request Already Made, please wait for its approval before making another one.' });
    }

    const newLeave = new Leave({
      user: userId,
      startDate,
      leaveType,
      status: 'pending',
    });

    const savedLeave = await newLeave.save();

    res.status(201).json({
      _id: savedLeave._id,
      user: savedLeave.user,
      startDate: savedLeave.startDate,
      leaveType: savedLeave.leaveType,
      status: savedLeave.status,
    });
  } catch (error) {
    console.error('Error creating leave:', error);
    console.error('Request details:', { params: req.params, body: req.body });
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getLeaveRequestsForAdmin = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' });
    const employeeIds = employees.map((employee) => employee._id);

    const leaveRequests = await Leave.find({ user: { $in: employeeIds } })
      .populate('user', 'name designation');

    const responseLeaveRequests = leaveRequests.map((leave) => ({
      _id: leave._id,
      user: leave.user,
      startDate: leave.startDate,
      leaveType: leave.leaveType,
      status: leave.status,
    }));

    return res.status(200).json(responseLeaveRequests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserLeaveRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const leaveRequests = await Leave.find({ user: userId }).populate('user', 'name');

    const formattedLeaveRequests = leaveRequests.map((leave) => ({
      status: leave.status,
      name: leave.user.name,
      leaveDate: leave.startDate,
    }));

    return res.status(200).json({ user: user.name, leaveRequests: formattedLeaveRequests });
  } catch (error) {
    console.error('Error in getUserLeaveRequests:', error);

    // Log specific information about the error
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const approveLeaveRequestByAdmin = async (req, res) => {
  try {
    const { leaveID, status } = req.body;

    if (!leaveID) {
      console.error('Leave ID is missing in the request body.');
      return res.status(400).json({ message: 'Leave ID is required in the request body' });
    }
    
    const leaveRequest = await Leave.findById(leaveID);
    if (!leaveRequest) {
      console.error('Leave request not found. Leave ID:', leaveID);
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leaveRequest.status = status;
    const updatedLeaveRequest = await leaveRequest.save();
    if (status === 'approved') {
      const newAttendance = new Attendance({
        user: updatedLeaveRequest.user,
        date: updatedLeaveRequest.startDate,
        status: 'present',
        leaveType: updatedLeaveRequest.leaveType,
      });
      await newAttendance.save();
      if (updatedLeaveRequest.leaveType === 'casual' || updatedLeaveRequest.leaveType === 'sick') {
        const user = await User.findById(updatedLeaveRequest.user);
        if (user) {
          if (updatedLeaveRequest.leaveType === 'casual') {
            user.casualDays -= 1;
          } else if (updatedLeaveRequest.leaveType === 'sick') {
            user.sickDays -= 1;
          }
          await user.save();
        }
      }
    }
    res.status(200).json({ message: 'Leave request updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getUserLeaveRequests,
  createSickLeave,
  getLeaveRequestsForAdmin,
  approveLeaveRequestByAdmin,
};
