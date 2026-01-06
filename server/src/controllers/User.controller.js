import imagekit from "../config/imagekit.js";
import { redis } from "../db/redis.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { User } from "../models/User.model.js";
import {
  comparePassword,
  generateTokens,
  hashPassword,
  verifyRefreshToken,
} from "../utils/auth.js";
import {
  badRequestError,
  conflictError,
  internalError,
  notFoundError,
} from "../utils/errors.js";

export const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw badRequestError("Missing required fields");
  }

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    if (userExists.username === username) {
      throw conflictError("Username already in use");
    }
    if (userExists.email === email) {
      throw conflictError("Email already in use");
    }
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (!newUser) {
    throw internalError("User could not be created! Please try again.");
  }

  const { accessToken, refreshToken } = generateTokens({
    userId: newUser._id.toString(),
    username: newUser.username,
  });

  const user = newUser.toObject();
  delete user.password;

  await redis.set(
    `user:${newUser._id}`,
    JSON.stringify({
      ...user,
      refreshToken: refreshToken,
      lastSeen: new Date().toISOString(),
    })
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res
    .status(201)
    .json({ message: "User signed up successfully", user, accessToken });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw badRequestError("Missing required fields");
  }

  const userExists = await User.findOne({ email });

  if (!userExists) {
    throw notFoundError("User not found");
  }

  const isPasswordValid = await comparePassword(password, userExists.password);

  if (!isPasswordValid) {
    throw badRequestError("Invalid credentials");
  }

  const { accessToken, refreshToken } = generateTokens({
    userId: userExists._id.toString(),
    username: userExists.username,
  });

  const user = userExists.toObject();
  delete user.password;

  await redis.set(
    `user:${userExists._id}`,
    JSON.stringify({
      ...user,
      refreshToken: refreshToken,
      lastSeen: new Date().toISOString(),
    })
  );

  userExists.lastSeen = new Date();
  await userExists.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res
    .status(200)
    .json({ message: "User logged in successfully", user, accessToken });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw badRequestError("Not authenticated!");
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw badRequestError("Invalid refresh token");
  }

  const cached = await redis.get(`user:${decoded.userId}`);
  const session = cached ? JSON.parse(cached) : null;
  if (!session || session.refreshToken !== refreshToken) {
    throw badRequestError("Invalid refresh token");
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    generateTokens({
      userId: decoded._id.toString(),
      username: decoded.username,
    });

  await redis.set(
    `user:${decoded.userId}`,
    JSON.stringify({
      ...session,
      refreshToken: newRefreshToken,
      lastSeen: new Date().toISOString(),
    })
  );

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    accessToken: newAccessToken,
    message: "Access token refreshed successfully",
  });
});

export const logout = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  await redis.del(`user:${_id.toString()}`);
  await User.findByIdAndUpdate(_id, { lastSeen: new Date() });

  res.clearCookie("refreshToken");

  res.status(200).json({ message: "User logged out successfully" });
});

export const getSession = asyncHandler(async (req, res) => {
  const user = req.user;
  delete user.refreshToken;

  return res.status(200).json({ user: user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  const { username } = req.body;
  const avatar = req.file;

  let data = {
    username,
  };

  if (avatar) {
    const uploadRes = await imagekit.upload({
      file: avatar.buffer.toString("base64"),
      fileName: avatar?.originalname || `${user._id.toString()}.png`,
      folder: "connecto/avatars",
    });

    if (!uploadRes.fileId) throw internalError("Failed to upload avatar!");

    data.avatar = {
      fileId: uploadRes.fileId,
      url: uploadRes.url,
    };

    if (user?.avatar?.fileId) {
      await imagekit.deleteFile(user.avatar.fileId);
    }
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id.toString() },
    {
      ...data,
    },
    { new: true }
  ).select("-password");

  if (!user) {
    throw notFoundError("User not found");
  }

  await redis.set(
    `user:${user._id.toString()}`,
    JSON.stringify({
      ...user,
      username: updatedUser.username,
      avatar: updatedUser.avatar,
      lastSeen: new Date().toISOString(),
    })
  );

  res.json({ user: updatedUser, message: "Profile updated" });
});
