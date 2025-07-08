
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI );
    console.log('Database connected');
  } catch (err) {
    console.error('Something bad happened:', err);
  }
};

module.exports = connectDB;
