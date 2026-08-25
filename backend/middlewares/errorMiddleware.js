import { sendError } from "../utils/apiResponse.js";
import { env } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  console.error("Centralized Error Handler caught:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred on the server";
  const details = env.NODE_ENV === "development" ? err.stack : null;

  return sendError(res, message, details, statusCode);
};
