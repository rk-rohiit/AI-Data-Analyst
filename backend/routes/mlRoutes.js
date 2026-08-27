import express from "express";
import { runPythonPreprocessing } from "../services/pythonService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

const router = express.Router();

// POST /api/ml/preprocess
router.post("/preprocess", async (req, res, next) => {
  try {
    const { filePath, target, features, scaling, testSize } = req.body;
    
    if (!filePath) {
      return sendError(res, "Missing filePath parameter", null, 400);
    }
    if (!target) {
      return sendError(res, "Missing target column parameter", null, 400);
    }
    
    const scalingStrategy = scaling || "standard";
    const splitRatio = testSize !== undefined ? parseFloat(testSize) : 0.2;
    
    // 🔥 Call Python ML Preprocessor
    const result = await runPythonPreprocessing(
      filePath, 
      target, 
      features || [], 
      scalingStrategy, 
      splitRatio
    );
    
    if (result.error || !result.success) {
      return sendError(res, result.error || "Preprocessing failed", null, 500);
    }
    
    return sendSuccess(res, "Dataset preprocessed successfully", result);
  } catch (error) {
    next(error);
  }
});

export default router;
