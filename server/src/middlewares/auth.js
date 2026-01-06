import { redis } from "../db/redis.js";
import mongoose from "mongoose";
import { unauthorizedError } from "../utils/errors.js";
import { verifyAccessToken } from "../utils/auth.js";

export const requireAuth = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies.accessToken ||
      (req?.headers?.authorization?.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    if (!accessToken) {
      throw unauthorizedError("Not authenticated!");
    }

    const decoded = verifyAccessToken(accessToken);

    if (decoded) {
      let user = null;

      const cached = await redis.get(`user:${decoded.userId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        user = {
          ...parsed,
          _id: new mongoose.Types.ObjectId(`${parsed._id}`),
        };
        if (user) {
          req.user = user;

          return next();
        }
      }
    }

    throw unauthorizedError("Session expired");
  } catch (error) {
    next(error);
  }
};
