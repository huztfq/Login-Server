require('dotenv').config();
const mongoose = require('mongoose');

const connectToOnlineDB = async () => {
  try {
    const onlineURI = process.env.MONGODB_CONNECT_URI;
    if (!onlineURI) {
      throw new Error('MONGODB_CONNECT_URI is not defined in the environment variables.');
    }

    await mongoose.connect(onlineURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to Cloud MongoDB Server');
  } catch (error) {
    console.error('ERROR:', error.message);
    console.log('Attempting to connect to the local MongoDB server...');

    const localURI = 'mongodb://127.0.0.1:27017/avrox';

    try {
      await mongoose.connect(localURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log('Connected to Local MongoDB Server');
    } catch (localError) {
      console.error('ERROR:', localError.message);
      process.exit(1);
    }
  }
};

module.exports = connectToOnlineDB;
