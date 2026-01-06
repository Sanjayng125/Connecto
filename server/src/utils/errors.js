import AppError from "./appError.js";

export const badRequestError = (msg = "Bad Request") => new AppError(msg, 400);

export const unauthorizedError = (msg = "Unauthorized") =>
  new AppError(msg, 401);

export const forbiddenError = (msg = "Forbidden") => new AppError(msg, 403);

export const notFoundError = (msg = "Not Found") => new AppError(msg, 404);

export const conflictError = (msg = "Conflict") => new AppError(msg, 409);

export const internalError = (msg = "Internal Server Error") =>
  new AppError(msg, 500);

export const validationError = (msg = "Invalid Data") => new AppError(msg, 422);
