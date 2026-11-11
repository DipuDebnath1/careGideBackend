import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

// ─── List All Users ───────────────────────────────────────────────────────────

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
});

// ─── Get Single User ──────────────────────────────────────────────────────────

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.getUserById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});

// ─── Admin Create User ────────────────────────────────────────────────────────

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: user,
  });
});

// ─── Admin Update User ────────────────────────────────────────────────────────

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.updateUser(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

// ─── Admin Delete User ────────────────────────────────────────────────────────

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.deleteUser(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

export const UserController = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
