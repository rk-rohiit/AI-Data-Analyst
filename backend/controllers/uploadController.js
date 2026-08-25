import { runPythonAnalysis } from "../services/pythonService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

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

    return sendSuccess(res, "File uploaded & analyzed successfully", {
      filePath,
      analysis,
    });

  } catch (error) {
    next(error);
  }
};