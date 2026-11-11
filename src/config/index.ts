import dotenv from "dotenv";

dotenv.config();


const envData = {
    IP_ADDRESS: process.env.IP_ADDRESS || "127.0.0.1",
    PORT: Number(process.env.PORT) || 5000,
    DATABASE_URI: process.env.DATABASE_URI || "mongodb://localhost:27017/care_guide",
    NODE: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET || "secret_key",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
      // Email settings
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.SMTP_MAIL,
  },
}

export default envData;
