
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import config from "../../config";

// Cookie options 
const cookieOptions = {
  httpOnly: true,                     
  secure: config.NODE === "production",      
  sameSite: "strict" as const,             
  maxAge: 24 * 60 * 60 * 1000,     
};

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  // Set token in HTTP-only cookie
  res.cookie("token", result.token, cookieOptions);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Registration successful",
    data: result.user,
    token: result.token,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  // Set token in HTTP-only cookie
  res.cookie("token", result.token, cookieOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result.user,
    token: result.token,
  });
});

export const AuthController = {
  register,
  login,
};
