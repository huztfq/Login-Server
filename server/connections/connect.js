require('dotenv').config();

const mongoose = require('mongoose');

// Check if MONGO_CONNECT_URI is defined in .env
if (!process.env.MONGODB_CONNECT_URI) {
  console.error('ERROR: Missing environment variable MONGODB_CONNECT_URI');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT_URI);
    console.log('Database Server Connected');
  } catch (error) {
    console.error('ERROR:', error.message);
  }
};

module.exports = connectDB;