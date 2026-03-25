import { runPythonAnalysis } from "../services/pythonService.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    // 🔥 Call Python AI Agent
    const analysis = await runPythonAnalysis(filePath);

    // handle python error
    if (analysis.error) {
      return res.status(500).json({
        success: false,
        message: "Python analysis failed",
        error: analysis.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "File uploaded & analyzed successfully",
      filePath,
      analysis,
    });

  } catch (error) {
    console.error("Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};