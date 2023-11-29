import mongoose from 'mongoose';
import dotenv, { config } from 'dotenv';
dotenv.config();

const MONGODB_URI = 'your_mongodb_connection_string';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASEURI||"");
    console.log('Mongo DB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default connectDB;
