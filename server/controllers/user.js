const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const { setUser } = require("../service/auth");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const handleUserSignup = async (req, res) => {
  try {
    const { name, email, password, role, joiningDate, designation } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Password must be strong: one capital, one number, one special character, and at least 8 characters long." });
    }
    const newUser = new User({
      name,
      email,
      password,
      role,
      joiningDate: new Date(joiningDate),
      designation,
    });

    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email is already registered. Please use a different email address." });
    }

    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid Email" });
    }
        
    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch && password === user.password) {
        passwordMatch = true;
      }
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid Password" });
      }
    } catch (error) {
      console.error("Error comparing passwords with bcrypt:", error);
    }
    const token = jwt.sign(
      { user_id: user._id, email, role: user.role },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    setUser(token, user);
    const decoded = jwt.decode(token);
    setUser(token, user, decoded.exp);

    const resObject = {
      userId: user._id,
      token,
      role: user.role,
      name: user.name,
    };

    return res.json(resObject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}

async function handleUserResetPassword(req, res) {
  try {
     const { email, currentPassword, newPassword, confirmNewPassword } = req.body;

     const user = await User.findOne({ email });

     if (!user) {
        return res.status(404).json({ error: "User not found." });
     }

     const isCurrentPasswordValid = currentPassword && user.password ? await bcrypt.compare(currentPassword, user.password) : false;
     if (!isCurrentPasswordValid) {
        return res.status(401).json({ error: "Invalid current password." });
     }

     if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ error: "New password and confirm new password do not match." });
     }

     const hashedNewPassword = await bcrypt.hash(newPassword, 10);
     await User.findOneAndUpdate({ email }, { $set: { password: hashedNewPassword } });

     return res.json({ message: "Password reset successfully." });
  } catch (error) {
     console.error(error);
     return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}

async function handleInfo(req, res) {
  res.send('Welcome to Avrox');
}

async function handleDeleteEmployees(req, res) {
  try {
    const { userId } = req.params;

    const requestingUser = await User.findById(userId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ error: "Permission denied. Only admins can perform this action." });
    }

    const deletedUsers = await User.deleteMany({ role: 'employee' });

    return res.json({ message: `Deleted ${deletedUsers.deletedCount} employee(s) successfully.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}

async function handleFetchEmployeeDetails(req, res) {
  try {
    const { userId } = req.params;

    const employeeDetails = await User.findById(userId, 'name email designation joiningDate role');
    if (!employeeDetails) {
      return res.status(404).json({ error: "Employee not found." });
    }

    return res.json(employeeDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}

async function handleUpdateEmployeeDetails(req, res) {
  try {
    const { userId } = req.params;

    const employee = await User.findById(userId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const { name, email, designation, joiningDate, password, role } = req.body;

    if (name) employee.name = name;
    if (email) employee.email = email;
    if (designation) employee.designation = designation;
    if (joiningDate) employee.joiningDate = new Date(joiningDate);
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      employee.password = hashedPassword;
    }
    if (role) employee.role = role;

    await employee.save(); 
    return res.json({ message: "Employee details updated successfully." });
  } catch (error) {
    console.error("Error during password update:", error);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}

async function handleDeleteEmployee(req, res) {
  try {
    const { userId } = req.params;
    console.log(userId);
    const requestingUser = await User.findById(userId);
    if (!requestingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not deleted." });
    }

    return res.json({ message: `Deleted user with ID ${userId} successfully.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}

async function handleForgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpires = Date.now() + 600000; 

    user.otp = otp.toString();
    user.otpExpires = new Date(otpExpires);
    await user.save();

    const mailOptions = {
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Welcome to PTO Portal!\n\n` +
            `Your one-time password (OTP) for password reset is: ${otp}.\n\n` +
            `Feel free to reach out if you have any questions or need assistance.\n\n` +
            `Best regards,\nAvrox Solutions`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset OTP sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleVerifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserResetPassword,
  handleInfo,
  handleDeleteEmployees,
  handleFetchEmployeeDetails,
  handleUpdateEmployeeDetails,
  handleDeleteEmployee,
  handleForgotPassword,
  handleVerifyOTP,
};
