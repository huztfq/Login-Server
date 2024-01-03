const Leave = require('../models/leave');
const User = require('../models/user');
const Attendance = require('../models/attendance');

const createSickLeave = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, status, message, multipleDates } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if there is an existing leave entry with state 'pending'
    const existingPendingLeave = await Leave.findOne({
      user: userId,
      state: 'pending',
    });

    if (existingPendingLeave) {
      return res.status(400).json({ message: 'Pending leave request already exists for the user.' });
    }

    let existingLeave;

    if (multipleDates) {
      // Check if there is an existing leave entry for each date in the range
      const dateRange = getDatesBetween(startDate, endDate);
      existingLeave = await Leave.findOne({
        user: userId,
        startDate: { $in: dateRange },
        state: 'pending',
      });
    } else {
      // Check if there is an existing leave entry for the given date
      existingLeave = await Leave.findOne({
        user: userId,
        startDate,
        state: 'pending',
      });
    }

    if (existingLeave) {
      // Rewrite the existing entry if it exists
      existingLeave.startDate = startDate;
      existingLeave.endDate = endDate;
      existingLeave.status = status;
      existingLeave.message = message;
      existingLeave.workingDays = calculateWorkingDays(new Date(startDate), new Date(endDate));

      const updatedLeave = await existingLeave.save();

      return res.status(200).json({
        _id: updatedLeave._id,
        user: updatedLeave.user,
        startDate: updatedLeave.startDate,
        endDate: updatedLeave.endDate,
        status: updatedLeave.status,
        message: updatedLeave.message,
        workingDays: updatedLeave.workingDays,
      });
    }

    // If no existing entry, create a new one
    let workingDays;

    if (multipleDates) {
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      workingDays = calculateWorkingDays(parsedStartDate, parsedEndDate);
    } else {
      workingDays = 0;
    }

    const newLeave = new Leave({
      user: userId,
      startDate,
      endDate,
      status,
      message,
      state: 'pending',
      workingDays,
    });

    const savedLeave = await newLeave.save();

    res.status(201).json({
      _id: savedLeave._id,
      user: savedLeave.user,
      startDate: savedLeave.startDate,
      endDate: savedLeave.endDate,
      leaveType: savedLeave.leaveType,
      status: savedLeave.status,
      message: savedLeave.message,
      workingDays: savedLeave.workingDays,
    });

  } catch (error) {
    console.error('Error creating leave:', error);
    console.error('Request details:', { params: req.params, body: req.body });
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


const calculateWorkingDays = (startDate, endDate) => {
  let workingDays = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workingDays;
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
      endDate: leave.endDate,
      status: leave.status,
      state: leave.state,
      message: leave.message,
      approvedby: leave.approvedby,
      workingDays: leave.workingDays,
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
      state: leave.state,
      name: leave.user.name,
      leaveDate: leave.startDate,
      endDate: leave.endDate, 
      leaveType: leave.leaveType,
      status: leave.status,
      message: leave.message,
      approvedby: leave.approvedby,
      
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
    const { leaveID, name, userid, state } = req.body;

    if (!leaveID || !state) {
      console.error('Leave ID or state is missing in the request body.');
      return res.status(400).json({ message: 'Leave ID and state are required in the request body' });
    }

    const leaveRequest = await Leave.findById(leaveID);
    if (!leaveRequest) {
      console.error('Leave request not found. Leave ID:', leaveID);
      return res.status(404).json({ message: 'Leave request not found' });
    }

    const user = await User.findById(userid);
    if (!user) {
      console.error('User not found. UserID:', userid);
      return res.status(404).json({ message: 'User not found' });
    }

    if (state.toLowerCase() === 'approved') {
      const leaveStatus = leaveRequest.status;
      const startDate = new Date(leaveRequest.startDate);
      const endDate = new Date(leaveRequest.endDate);
      const datesToUpdate = getDatesBetween(startDate, endDate);

      const updateAttendance = async (date) => {
        const existingAttendance = await Attendance.findOne({ user: userid, date });

        if (existingAttendance) {
          await Attendance.updateOne(
            { _id: existingAttendance._id },
            { $set: { status: leaveStatus } }
          );
        } else {
          const payload = {
            user: userid,
            date,
            approvedby: name,
            state: 'approved',
          };

          if (leaveStatus === 'sick' || leaveStatus === 'casual' || leaveStatus === 'absent' || leaveStatus === 'halfday' || leaveStatus === 'pto') {
            await Attendance.create({
              ...payload,
              status: leaveStatus,
            });
          }
        }
      };

      for (const currentDate of datesToUpdate) {
        console.warn("currentDate:", currentDate)
        await updateAttendance(currentDate);
      }

      await Leave.updateOne(
        { _id: leaveID },
        { $set: { state: state, approvedby: name } }, // Fix: Change 'State' to 'state'
      );

      return res.status(200).json({ message: 'Leave request approved successfully' });

    } else if (state.toLowerCase() === 'declined') {
      await Leave.updateOne(
        { _id: leaveID },
        { $set: { state: state, approvedby: name } }, // Fix: Change 'State' to 'state'
      );

      return res.status(200).json({ message: 'Leave request declined successfully' });

    } else {
      console.error('Invalid state for leave approval. State:', state);
      return res.status(400).json({ message: 'Invalid state for leave approval' });
    }

  } catch (error) {
    console.error('Error in handleLeaveApproval:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

module.exports = {
  getUserLeaveRequests,
  createSickLeave,
  getLeaveRequestsForAdmin,
  approveLeaveRequestByAdmin,
};
