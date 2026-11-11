
import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";

  // OTP / password-reset fields
  passwordResetOtp?: string;
  passwordResetOtpExpires?: Date;
  passwordResetVerified?: boolean;

  createdAt: Date;
  updatedAt: Date;
}