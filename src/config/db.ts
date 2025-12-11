import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/TypeScript_project");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
};

export default ConnectDB;
