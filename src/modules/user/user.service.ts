import bcrypt from "bcryptjs";
import { PipelineStage } from "mongoose";
import AppError from "../../errors/AppError";
import User from "./user.model";

// ─── List All Users ───────────────────────────────────────────────────────────

const getAllUsers = async (query: any) => {

  const filter: any = {role: { $ne: "admin" }, isDeleted: false};

  if (query?.role) filter.role = query.role;
  if (query?.isDeleted) filter.isDeleted = query.isDeleted;

  if (query?.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  const page = parseInt(query?.page as string) || 1;
  const limit = parseInt(query?.limit as string) || 10;
  const skip = (page - 1) * limit;


  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select("name email role createdAt isDeleted interests"),
    User.countDocuments(filter),
  ]);

    return {
      data: users,
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
  const user = await User.findById(userId).select("name email role interests createdAt isDeleted");
  if (!user) throw new AppError(404, "User not found");
  return user;
};

// ─── Users grouped by  interest ──────────────────────────────────────────
const getUsersGroupedByInterest = async (query: any) => {
  const interestFilter = query?.interest?.trim().toLowerCase();
  const page = parseInt(query?.page as string) || 1;
  const limit = parseInt(query?.limit as string) || 10;
  const skip = (page - 1) * limit;

  const pipeline: PipelineStage[] = [
    { $match: { isDeleted: false, role: { $ne: "admin" } } },
    { $unwind: "$interests" },
    {
      $addFields: {
        interest: { $toLower: { $trim: { input: "$interests" } } },
      },
    },
    { $match: { interest: { $ne: "" } } },
  ];

  if (interestFilter) {
    pipeline.push({ $match: { interest: interestFilter } });
  }

  pipeline.push(
    {
      $group: {
        _id: "$interest",
        users: {
          $push: {
            id: "$_id",
            name: "$name",
            email: "$email",
            role: "$role",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        interest: "$_id",
        count: { $size: "$users" },
        users: 1,
      },
    },
    { $sort: { interest: 1 } },
    // pagination
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        total: [{ $count: 'count' }],
      },
    },
  
  );



  const result = await User.aggregate(pipeline);
  
  const total = result[0]?.total[0]?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: result[0]?.data ?? [],
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};


// ─── Admin Create User ────────────────────────────────────────────────────────

const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
  interests?: string[];
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
    interests: payload.interests ?? [],
  });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    interests: user.interests,
  };
};

// ─── Admin Update User ────────────────────────────────────────────────────────

const updateUser = async (
  userId: string,
  payload: { name?: string; email?: string; role?: "user" | "admin"; interests?: string[] }
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

  const user = await User.findByIdAndUpdate(userId, {
    $set: payload,
  }, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) throw new AppError(404, "User not found");
  return user;
};

// ─── Admin Delete User ────────────────────────────────────────────────────────

const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndUpdate(userId, {isDeleted: true});
  if (!user) throw new AppError(404, "User not found");
  return { message: "User deleted successfully" };
};

export const UserService = {
  getAllUsers,
  getUserById,
  getUsersGroupedByInterest,
  createUser,
  updateUser,
  deleteUser,
};
