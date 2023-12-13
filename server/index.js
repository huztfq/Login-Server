// server.js
require('dotenv').config(); 
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectToOnlineDB  = require("./connections/connect");
const cors = require("cors");

const userRoute = require("./routes/user");
const userAttendace = require("./routes/attendanceRoute");
const app = express();
const PORT = 8001;

// Connect to MongoDB and set up other configurations
connectToOnlineDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Add a simple route handler for the root path
app.get("/", (req, res) => {
  res.send("Welcome to the portal");
});

app.use("/user", userRoute);
app.use("/attendance", userAttendace);

// Set up other middleware and configurations as needed

app.listen(PORT, () => console.log(`Web Server Started at PORT:${PORT}`));