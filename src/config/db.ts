import config from "./index";
import mongoose from "mongoose";

let connection: Promise<typeof mongoose> | null = null;

const connectDB = (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }

  if (!config.DATABASE_URI) {
    return Promise.reject(new Error("DATABASE_URI is not set"));
  }

  if (!connection) {
    connection = mongoose
      .connect(config.DATABASE_URI, { serverSelectionTimeoutMS: 8000 })
      .then((mongooseInstance) => {
        console.log(
          `MongoDB Database connected: ${mongooseInstance.connection.host}`
        );
        return mongooseInstance;
      })
      .catch((error: unknown) => {
        connection = null;
        console.error("MongoDB Database connection failed:", error);
        throw error;
      });
  }

  return connection;
};

export default connectDB;
