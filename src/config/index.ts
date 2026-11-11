import dotenv from "dotenv";

dotenv.config();


const envData = {
    PORT: process.env.PORT || 5000,
    DATABASE_URI: process.env.DATABASE_URI || "mongodb://localhost:27017/care_guide",
    NODE: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET || "secret_key",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
}

export default envData;
