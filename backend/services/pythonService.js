import { spawn } from "child_process";
import path from "path";

export const runPythonAnalysis = (filePath) => {
  return new Promise((resolve, reject) => {

    // ✅ absolute paths (IMPORTANT)
    const scriptPath = path.resolve("../ai-agent/analyze.py");

    // ✅ use venv python
    const pythonPath = path.resolve("../ai-agent/venv/Scripts/python.exe");

    const process = spawn(pythonPath, [scriptPath, filePath]);

    let result = "";

    process.stdout.on("data", (data) => {
      result += data.toString();
    });

    process.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
    });

    process.on("close", () => {
      try {
        resolve(JSON.parse(result));
      } catch (error) {
        reject(error);
      }
    });

  });
};