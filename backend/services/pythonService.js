import { spawn } from "child_process";
import path from "path";

export const runPythonAnalysis = (filePath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve("../ai-agent/analyze.py");
    const pythonPath = path.resolve("../ai-agent/venv/Scripts/python.exe");

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