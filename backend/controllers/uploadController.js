import crypto from "crypto";
import path from "path";
import fs from "fs";
import { runPythonAnalysis } from "../services/pythonService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

const formatBytes = (bytes, decimals = 2) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, "No file uploaded", null, 400);
    }

    const filePath = req.file.path;

    // 🔥 Call Python AI Agent
    const analysis = await runPythonAnalysis(filePath);

    // handle python error
    if (analysis.error) {
      const error = new Error(analysis.error);
      error.statusCode = 500;
      throw error;
    }

    const datasetId = crypto.randomUUID();

    return sendSuccess(res, "File uploaded & analyzed successfully", {
      datasetId,
      filename: req.file.originalname,
      rows: analysis.rows,
      columns: analysis.columns,
      size: formatBytes(req.file.size),
      filePath,
      analysis,
    });

  } catch (error) {
    next(error);
  }
};

// GET /api/upload/download/:filename
export const downloadFile = (req, res, next) => {
  try {
    const { filename } = req.params;
    // Sanitization: prevent directory traversal by taking only base name
    const safeFilename = path.basename(filename);
    const filePath = path.resolve("uploads", safeFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    res.download(filePath);
  } catch (error) {
    next(error);
  }
};