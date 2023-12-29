const Leave = require('../models/leave');
const User = require('../models/user');
const Attendance = require('../models/attendance');

const createSickLeave = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, leaveType, message, multipleDates } = req.body;

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

    let workingDays;

    if (multipleDates) {
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      workingDays = calculateWorkingDays(parsedStartDate, parsedEndDate);
    } else {
      console.log('Not Calculated');
      workingDays = 0;
    }

    console.log('workingDays:', workingDays);

    const newLeave = new Leave({
      user: userId,
      startDate,
      endDate,
      leaveType,
      message,
      status: 'pending',
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
      leaveType: leave.leaveType,
      status: leave.status,
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
      status: leave.status,
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
    const { leaveID, status, name, userid } = req.body;

    if (!leaveID || !status) {
      console.error('Leave ID or status is missing in the request body.');
      return res.status(400).json({ message: 'Leave ID and status are required in the request body' });
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

    const leaveType = leaveRequest.leaveType.toLowerCase();

    const startDate = new Date(leaveRequest.startDate);
    const endDate = new Date(leaveRequest.endDate);
    const datesToUpdate = getDatesBetween(startDate, endDate);

    const updateAttendance = async (date) => {
      const dayOfWeek = new Date(date).getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        if (status.toLowerCase() === 'approved' && (leaveType === 'sick' || leaveType === 'casual')) {
          await Attendance.updateOne(
            { user: userid, date },
            { $set: { status: 'absent', leaveType } }
          );
        } else if (status.toLowerCase() === 'approved' && (leaveType === 'pto' || leaveType === 'halfday')) {
          await Attendance.updateOne(
            { user: userid, date },
            { $set: { status: leaveType, leaveType } }
          );
        }
      }
    };

    for (const currentDate of datesToUpdate) {
      await updateAttendance(currentDate);
    }

    return res.status(200).json({ message: 'Leave request approved successfully' });
  } catch (error) {
    console.error('Error in approveLeaveRequestByAdmin:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

  const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(new Date(currentDate));
    }
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
