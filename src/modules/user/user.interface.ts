
import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isDeleted: boolean;

  passwordResetOtp?: string;
  passwordResetOtpExpires?: Date;
  passwordResetVerified?: boolean;

  createdAt: Date;
  updatedAt: Date;
}