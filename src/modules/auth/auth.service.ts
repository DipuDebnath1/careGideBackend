
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../user/user.model";
import { LoginInput, RegisterInput } from "./auth.interface";
import config from "../../config";
import AppError from "../../errors/AppError";


// Generate JWT token
const generateToken = (userId: string, role: string) => {
  const jwtSecret = config.JWT_SECRET;

  // Generate JWT
  const accessToken = jwt.sign(
    {
      userId: userId,
      role: role,
    },
    jwtSecret,
    {
      expiresIn: "1d",
    }
  );

  return accessToken;
}


// Check if password matches
const isMatchPassword = async (password: string, hashedPassword: string) => await bcrypt.compare(password, hashedPassword);

const register = async (payload: RegisterInput) => {
  const email = payload.email.trim().toLowerCase();

  const existingUser = await User.findOne({ email });

  if (existingUser) 
    throw new AppError(400, "Email already registered");
  

  // Hash password
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  // Create user
  const user = await User.create({
    name: payload.name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id.toString(), user.role);

  // Return user data and token
  return{
  user: {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  },
    token,
  };

};

// Login user
const login = async (payload: LoginInput) => {
  const email = payload.email.trim().toLowerCase();

  const user = await User.findOne({ email }).select("+password");

  // Check if user exists
  if (!user) 
    throw new  AppError(401, "Invalid email or password");
  
// Check if password matches
  if (!isMatchPassword(payload.password, user.password))  throw new  AppError(401, "Invalid email or password");
  
// Generate token
  return {
    user : {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id.toString(), user.role),
    };
};

export const AuthService = {
  register,
  login,
};
