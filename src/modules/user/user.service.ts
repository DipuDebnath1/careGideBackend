import bcrypt from "bcryptjs";
import User from "./user.model";
import AppError from "../../errors/AppError";
import { PipelineStage } from "mongoose";

// ─── List All Users ───────────────────────────────────────────────────────────

const getAllUsers = async (query: any) => {

  const filter: any = {};
  if (query?.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  const page = parseInt(query?.page as string) || 1;
  const limit = parseInt(query?.limit as string) || 10;
  const skip = (page - 1) * limit;


  // Apply any name mail filtering based on the query

  const pipeline: PipelineStage[] = [
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "notes",
        localField: "_id",
        foreignField: "owner",
        as: "notes",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        role: 1,
        notesCount: { $size: "$notes" },
      },
    },
  ]

     const paginatedPipeline: PipelineStage[] = [
      ...pipeline,
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: 'count' }],
        },
      },
    ];

    const result = await User.aggregate(paginatedPipeline);

    const data = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

};

// ─── Get Single User ──────────────────────────────────────────────────────────

const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new AppError(404, "User not found");
  return user;
};

// ─── Admin Create User ────────────────────────────────────────────────────────

const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}) => {
  const email = payload.email.trim().toLowerCase();

  const existing = await User.findOne({ email });
  if (existing) throw new AppError(400, "Email already registered");

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const user = await User.create({
    name: payload.name,
    email,
    password: hashedPassword,
    role: payload.role ?? "user",
  });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

// ─── Admin Update User ────────────────────────────────────────────────────────

const updateUser = async (
  userId: string,
  payload: { name?: string; email?: string; role?: "user" | "admin" }
) => {
  // Prevent duplicate email
  if (payload.email) {
    const existing = await User.findOne({
      email: payload.email.trim().toLowerCase(),
      _id: { $ne: userId },
    });
    if (existing) throw new AppError(400, "Email already in use by another account");
    payload.email = payload.email.trim().toLowerCase();
  }

  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) throw new AppError(404, "User not found");
  return user;
};

// ─── Admin Delete User ────────────────────────────────────────────────────────

const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new AppError(404, "User not found");
  return { message: "User deleted successfully" };
};

export const UserService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
