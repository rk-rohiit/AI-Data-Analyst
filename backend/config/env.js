import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(".env") });

export const env = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || "development",
};
