const Leave = require('../models/leave');
const User = require('../models/user');
const Attendance = require('../models/attendance');
const jwt = require('jsonwebtoken');

const createSickLeave = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, leaveType, message } = req.body;

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
      return res.status(400).json({
        message: 'Request Already Made, please wait for its approval before making another one.',
      });
    }

    if (!['casual', 'sick'].includes(leaveType.toLowerCase().trim())) {
      return res.status(400).json({ message: 'Invalid leaveType. Allowed values are casual and sick.' });
    }

    const newLeave = new Leave({
      user: userId,
      startDate,
      leaveType,
      message,
      status: 'pending',
    });

    const savedLeave = await newLeave.save();

    res.status(201).json({
      _id: savedLeave._id,
      user: savedLeave.user,
      startDate: savedLeave.startDate,
      leaveType: savedLeave.leaveType,
      status: savedLeave.status,
      message: savedLeave.message,
    });
  } catch (error) {
    console.error('Error creating leave:', error);
    console.error('Request details:', { params: req.params, body: req.body });
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
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
      message: leave.message,
      approvedby: leave.approvedby,
    }));

    return res.status(200).json(responseLeaveRequests);
  } catch (error) {
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
      leaveType: leave.leaveType,
      status: leave.status,
    }));

    return res.status(200).json({ user: user.name, leaveRequests: formattedLeaveRequests });
  } catch (error) {
    console.error('Error in getUserLeaveRequests:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const approveLeaveRequestByAdmin = async (req, res) => {
  try {
    const { leaveID, status, name} = req.body;

    if (!leaveID || !status) {
      console.error('Leave ID or status is missing in the request body.');
      return res.status(400).json({ message: 'Leave ID and status are required in the request body' });
    }

    const leaveRequest = await Leave.findById(leaveID);
    if (!leaveRequest) {
      console.error('Leave request not found. Leave ID:', leaveID);
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leaveRequest.status = status;
    leaveRequest.approvedby = name;
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
    } else if (status === 'declined') {
      if (leaveRequest.status === 'pending') {
        leaveRequest.status = 'declined';
        await leaveRequest.save();
      }
    }

    res.status(200).json({ message: 'Leave request updated successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation Error:', error.errors);
      res.status(400).json({ message: 'Leave validation failed', errors: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = {
  getUserLeaveRequests,
  createSickLeave,
  getLeaveRequestsForAdmin,
  approveLeaveRequestByAdmin,
};
