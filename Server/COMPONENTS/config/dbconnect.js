const mongoose = require('mongoose');

// Database: INF245MWA on your local MongoDB. Collections: users, patients
const MONGO_URI = 'mongodb://localhost:27017/INF245MWA';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected: ${MONGO_URI}`);
  } catch (error) {
    console.error('Error connecting to MongoDB. Is MongoDB running on localhost:27017?');
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
