import { spawn } from "child_process";
import path from "path";

export const runPythonAnalysis = (filePath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve("../ai/ai_processor.py");
    const pythonPath = path.resolve("../ai/venv/Scripts/python.exe");

    const process = spawn(pythonPath, [scriptPath, filePath]);

    let result = "";
    let errorOutput = "";

    process.stdout.on("data", (data) => {
      result += data.toString();
    });

    process.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    process.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(errorOutput || "Python process failed"));
      }

      try {
        const parsed = JSON.parse(result);
        resolve(parsed);
      } catch (err) {
        reject(new Error("Invalid JSON from Python"));
      }
    });
  });
};

export const runPythonPreprocessing = (filePath, target, features, scaling, testSize) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve("../ai/machine_learning/preprocessing.py");
    const pythonPath = path.resolve("../ai/venv/Scripts/python.exe");

    const args = [
      scriptPath,
      "--filepath", filePath,
      "--target", target,
      "--scaling", scaling,
      "--test_size", testSize.toString()
    ];
    if (features && features.length > 0) {
      args.push("--features", features.join(","));
    }

    const process = spawn(pythonPath, args);

    let result = "";
    let errorOutput = "";

    process.stdout.on("data", (data) => {
      result += data.toString();
    });

    process.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    process.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(errorOutput || "Python preprocessing process failed"));
      }

      try {
        const parsed = JSON.parse(result);
        resolve(parsed);
      } catch (err) {
        reject(new Error("Invalid JSON from Python Preprocessor"));
      }
    });
  });
};