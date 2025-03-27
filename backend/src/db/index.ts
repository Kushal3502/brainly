import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(String(process.env.MONGO_URI));
    console.log("🍀MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error :: ", error);
    process.exit(1);
  }
};

export default connectDB;
