import config from "./index";
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(
      config.DATABASE_URI as string
    );

    console.log(
      `MongoDB Database connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
