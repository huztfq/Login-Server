const Leave = require('../models/leave');
const User = require('../models/user');
const Attendance = require('../models/attendance');

const createSickLeave = async (req, res) => {
  let workingDays = 0;
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

    const existingPendingLeave = await Leave.findOne({
      user: userId,
      state: 'pending',
    });

    if (existingPendingLeave) {
      return res.status(400).json({ message: 'Pending leave request already exists for the user.' });
    }

    if (multipleDates) {
      workingDays = calculateWorkingDays(new Date(startDate), new Date(endDate));
    }
    
    const newLeave = new Leave({
      user: userId,
      startDate,
      endDate,
      status,
      message,
      state: 'pending',
      workingDays:  workingDays,
    });
    
    console.log('New leave:', multipleDates ? newLeave.workingDays : undefined);
    const savedLeave = await newLeave.save();

    res.status(201).json({
      _id: savedLeave._id,
      user: savedLeave.user,
      startDate: savedLeave.startDate,
      endDate: savedLeave.endDate,
      status: savedLeave.status,
      message: savedLeave.message,
      workingDays: savedLeave.workingDays,
      timestamp: savedLeave.timestamp,
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

  console.log('workingDays:', workingDays);
  return workingDays;
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
      timestamp: leave.timestamp,
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
      timestamp: leave.timestamp,
      workingDays: leave.workingDays,
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
        { $set: { state: state, approvedby: name } }, 
      );

      return res.status(200).json({ message: 'Leave request approved successfully' });

    } else if (state.toLowerCase() === 'rejected') {
      await Leave.updateOne(
        { _id: leaveID },
        { $set: { state: state, approvedby: name } }, 
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

module.exports = {
  getUserLeaveRequests,
  createSickLeave,
  getLeaveRequestsForAdmin,
  approveLeaveRequestByAdmin,
};
