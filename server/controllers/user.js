const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const { setUser } = require("../service/auth");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
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
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials. Please check your email and password and try again." });
    }

    const token = jwt.sign(
      { user_id: user._id, email, role: user.role },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    setUser(token, user);

    const resObject = {
      token,
      role: user.role,
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


async function handleUserForgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.resetPasswordOTP = otp;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}

async function handleUserLogout(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token provided." });
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized - Invalid token." });
      }


      return res.json({ message: "User logged out successfully." });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}





module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserResetPassword,
  handleUserForgotPassword,
  handleUserLogout,
};
