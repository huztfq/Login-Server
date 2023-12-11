const mongoose = require('mongoose');

const connectToOnlineDB = async () => {
  const maxAttempts = 5; // Set the maximum number of reconnection attempts
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      const onlineURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTERID}/?retryWrites=true&w=majority` //third env cluster id
      if (!onlineURI) {
        throw new Error('MONGODB_CONNECT_URI is not defined in the environment variables.');
      }
      await mongoose.connect(onlineURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true, 
      });
      console.log('Connected to Cloud MongoDB Server');
      return; // Exit the function if connection is successful
    } catch (error) {
      console.error('ERROR:', error.message);
      attempts++;
      console.log(`Attempting to reconnect to the online MongoDB server. Attempt ${attempts} of ${maxAttempts}...`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Delay for 5 seconds before reattempt
    }
  }
  console.error('Failed to connect to the online MongoDB server after multiple attempts.');
  process.exit(1);
};
module.exports = connectToOnlineDB;