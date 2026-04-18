import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required");
  }

  const token = authHeader.split(" ")[1];
  const payload = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(payload.userId).select("-password");

  if (!user || !user.isActive) {
    throw new ApiError(401, "Invalid or inactive account");
  }

  req.user = user;
  next();
});
