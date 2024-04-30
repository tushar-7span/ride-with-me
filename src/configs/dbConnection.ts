import mongoose from "mongoose";
import { DB_DATA } from "../helper/constants";
import logger from "../utils/logger";

const connectDB = async () => {
  try {
    await mongoose.connect(DB_DATA.DB_URL);
    logger.info("Connected to MongoDB Atlas");
  } catch (error) {
    logger.error("Error connecting to MongoDB Atlas:", error);
  }
};

export default connectDB;