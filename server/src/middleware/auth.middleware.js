import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handle.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;
  console.log(token);

  if (!token) {
    throw new ApiError(401, "Not authorized, token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, "Not authorized, invalid token");
  }
});

export const checkAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied - Admins only" });
  }

  next();
});
