import mongoose from "mongoose";
import config from "./config";
import logger from "./logger";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB connected");
    logger.info("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    logger.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
