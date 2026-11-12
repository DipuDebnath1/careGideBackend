
import { Request } from "express";
import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  interests: string[];
  isDeleted: boolean;

  passwordResetOtp?: string;
  passwordResetOtpExpires?: Date;
  passwordResetVerified?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// req with user 
export interface IRequestWithUser extends Request {
  user: {
    userId: string;
    role: "user" | "admin";
  };
}