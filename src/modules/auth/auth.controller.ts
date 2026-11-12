
import { CookieOptions, Request, Response } from "express";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

// Cookie options shared between register and login
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.NODE === "production",
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
};
// ─── Register ────────────────────────────────────────────────────────────────

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  res.cookie("token", result.token, cookieOptions);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Registration successful",
    data: result.user,
    accessToken: result.token,
  });
});

// ─── Login ───────────────────────────────────────────────────────────────────

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  res.cookie("token", result.token, cookieOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result.user,
    accessToken: result.token,
  });
});

// ─── Forgot Password ─────────────────────────────────────────────────────────

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

// ─── Verify OTP ───────────────────────────────────────────────────────────────

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.verifyOtp(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

// ─── Reset Password ───────────────────────────────────────────────────────────

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.resetPassword(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

// ─── Update Password (authenticated user) ────────────────────────────────────

const updatePassword = catchAsync(async (req: Request, res: Response) => {
  // userId is injected by the auth middleware onto req.user
  const userId = (req as any).user?.userId;

  const result = await AuthService.updatePassword(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

export const AuthController = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  updatePassword,
};
