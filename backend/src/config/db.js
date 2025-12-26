// src/config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log(`Attempting to connect to MongoDB at ${process.env.MONGO_URI}...`);
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
};

export default connectDB;
