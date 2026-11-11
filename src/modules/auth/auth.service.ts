
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../user/user.model";
import {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  VerifyOtpInput,
  ResetPasswordInput,
  UpdatePasswordInput,
} from "./auth.interface";
import config from "../../config";
import AppError from "../../errors/AppError";
import { sendOtpVerificationMail } from "../../config/mail/sendOtp";


// Generate JWT token
const generateToken = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, role },
    config.JWT_SECRET,
    { expiresIn: "1d" }
  );
  return accessToken;
};

// Generate a 6-digit OTP
const generateOtp = (): string =>
  crypto.randomInt(100000, 999999).toString();

// Check if password matches
const isMatchPassword = async (password: string, hashedPassword: string) =>
  bcrypt.compare(password, hashedPassword);

// ─── Register ────────────────────────────────────────────────────────────────

const register = async (payload: RegisterInput) => {
  const email = payload.email.trim().toLowerCase();

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError(400, "Email already registered");

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const user = await User.create({
    name: payload.name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id.toString(), user.role);

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

// ─── Login ───────────────────────────────────────────────────────────────────
const login = async (payload: LoginInput) => {
  const email = payload.email.trim().toLowerCase();

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError(401, "Invalid email or password");

  const matched = await isMatchPassword(payload.password, user.password);
  if (!matched) throw new AppError(401, "Invalid email or password");

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id.toString(), user.role),
  };
};

// ─── Forgot Password ─────────────────────────────────────────────────────────

const forgotPassword = async (payload: ForgotPasswordInput) => {
  const email = payload.email.trim().toLowerCase();

  const user = await User.findOne({ email });
  if (!user) throw new AppError(404, "wrong email address");

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store hashed OTP for security
  const hashedOtp = await bcrypt.hash(otp, 10);

  await User.findByIdAndUpdate(user._id, {
    passwordResetOtp: hashedOtp,
    passwordResetOtpExpires: otpExpires,
    passwordResetVerified: false,
  });

  // Send OTP email
   sendOtpVerificationMail(email, otp);

  return { message: "OTP sent to your email." };
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────

const verifyOtp = async (payload: VerifyOtpInput) => {
  const email = payload.email.trim().toLowerCase();

  const user = await User.findOne({ email }).select(
    "+passwordResetOtp +passwordResetOtpExpires +passwordResetVerified"
  );
  if (!user) throw new AppError(404, "User not found");

  if (!user.passwordResetOtp || !user.passwordResetOtpExpires)
    throw new AppError(400, "request a new OTP .");

  // Check expiry
  if (user.passwordResetOtpExpires < new Date())
    throw new AppError(400, "OTP has expired. Please request a new one.");

  // Compare OTP
  const isOtpValid = await bcrypt.compare(payload.otp, user.passwordResetOtp);
  if (!isOtpValid) throw new AppError(400, "Invalid OTP");

  // Mark OTP as verified
  await User.findByIdAndUpdate(user._id, {
    passwordResetVerified: true,
  });

  return { message: "OTP verified successfully." };
};

// ─── Reset Password ───────────────────────────────────────────────────────────

const resetPassword = async (payload: ResetPasswordInput) => {
  const email = payload.email.trim().toLowerCase();

  const user = await User.findOne({ email }).select(
    "+passwordResetOtp +passwordResetOtpExpires +passwordResetVerified"
  );
  if (!user) throw new AppError(404, "account found with this email");

  // Must have verified OTP first
  if (!user.passwordResetVerified)
    throw new AppError(403, "verify your OTP first.");

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  // Update password and clear OTP fields
  await User.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    passwordResetOtp: undefined,
    passwordResetOtpExpires: undefined,
    passwordResetVerified: false,
  });

  return { message: "Password reset successfully" };
};

// ─── Update Password (authenticated) ─────────────────────────────────────────

const updatePassword = async (
  userId: string,
  payload: UpdatePasswordInput
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) throw new AppError(404, "User not found");

  // Verify current password
  const matched = await isMatchPassword(payload.currentPassword, user.password);
  if (!matched) throw new AppError(401, "Current password is incorrect");

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);
  await User.findByIdAndUpdate(userId, { password: hashedPassword });

  return { message: "Password updated successfully." };
};

export const AuthService = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  updatePassword,
};
