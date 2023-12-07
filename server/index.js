// server.js
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
require('dotenv').config();


const userRoute = require("./routes/user");

const app = express();
const PORT = 8001;

// Connect to MongoDB and set up other configurations
connectToMongoDB(process.env.MONGODB ?? "mongodb://127.0.0.1:27017/avrox").then(() =>
  console.log("Database Server Started")
);

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
