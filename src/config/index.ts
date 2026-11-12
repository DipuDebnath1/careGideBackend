import dotenv from "dotenv";

dotenv.config();

const envData = {
    IP_ADDRESS: process.env.IP_ADDRESS ,
    PORT: Number(process.env.PORT),
    DATABASE_URI: process.env.DATABASE_URI,
    NODE: process.env.NODE_ENV ,
    JWT_SECRET: process.env.JWT_SECRET ,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ,
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
