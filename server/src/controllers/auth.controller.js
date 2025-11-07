import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handle.js";
import { db } from "../libs/db.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserRole } from "../generated/prisma/index.js";

export const register = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const hashedpassword = await bcrypt.hash(password, 10);

  const newUser = await db.user.create({
    data: {
      email,
      name,
      password: hashedpassword,
      role: UserRole.USER,
    },
  });

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  const userData = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    image: newUser.image,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, userData, "User registered successfully..."));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: token,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, userData, "Logged in successfully"));
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwt", {
    ttpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
  });

  return res.status(200).json(new ApiResponse(200, "Logout successfully"));
});

export const getme = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});
