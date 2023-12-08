require('dotenv').config();
const mongoose = require('mongoose');

const connectToOnlineDB = async () => {
  try {
    const onlineURI = process.env.MONGODB_CONNECT_URI;
    await mongoose.connect(onlineURI);
    console.log('Connected to Cloud MongoDB Server');
  } catch (error) {
    console.error('ERROR:', error.message);
    console.log('Attempting to connect to the local MongoDB server...');

    const localURI = 'mongodb://127.0.0.1:27017/avrox';

    try {
      await mongoose.connect(localURI);
      console.log('Connected to Local MongoDB Server');
    } catch (localError) {
      console.error('ERROR:', localError.message);
      process.exit(1);
    }
  }
};

const connectDB = async () => {
  if (!process.env.MONGODB_CONNECT_URI) {
    console.error('ERROR: Missing environment variable MONGODB_CONNECT_URI');
    console.log('Attempting to connect to the local MongoDB server...');
    await connectToOnlineDB(); 
  } else {
    await connectToOnlineDB();
  }
};

module.exports = connectDB;
