import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import mlRoutes from "./routes/mlRoutes.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/upload", uploadRoutes);
app.use("/api/ml", mlRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// centralized error handling
app.use(errorHandler);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});