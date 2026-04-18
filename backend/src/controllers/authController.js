import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/token.js";

const buildAuthResponse = (user) => ({
  success: true,
  token: generateToken({ userId: user._id, role: user.role }),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    role: user.role,
  },
  role: user.role,
});

export const register = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    city: req.body.city,
  });

  res.status(201).json(buildAuthResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatches = await user.comparePassword(req.body.password);

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  res.json(buildAuthResponse(user));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});
