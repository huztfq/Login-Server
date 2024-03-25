// server.js
require('dotenv').config(); 
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectToOnlineDB  = require("./connections/connect");
const cors = require("cors");
const bodyParser = require('body-parser'); 
const authMiddleware = require("./middlewares/auth");

const userRoute = require("./routes/user");
const userAttendace = require("./routes/attendanceRoute");
const leaveRoute = require("./routes/leave");
const app = express();
const PORT = 8001;

// Connect to MongoDB and set up other configurations
connectToOnlineDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(authMiddleware.refreshTokenMiddleware);

// Add a simple route handler for the root path
app.get("/", (req, res) => {
  res.send("Welcome to the portal");
});

app.use("/user", userRoute);
app.use("/attendance", userAttendace);
app.use("/leave", leaveRoute);

// Set up other middleware and configurations as needed
app.listen(PORT, () => console.log(`Web Server Started at PORT:${PORT}`));