// server.js
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB  = require("../connections/connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("../middlewares/auth");
require('dotenv').config();

const userRoute = require("../routes/user");

const app = express();
const PORT = 8001;

// Connect to MongoDB and set up other configurations
connectDB();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Add a simple route handler for the root path
app.get("/", (req, res) => {
  res.send("Welcome to the portal");
});

app.use("/user", userRoute);

// Set up other middleware and configurations as needed

app.listen(PORT, () => console.log(`Web Server Started at PORT:${PORT}`));