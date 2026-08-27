import express from "express";
import { upload } from "../config/multerConfig.js";
import { uploadFile, downloadFile } from "../controllers/uploadController.js";

const router = express.Router();

// POST /api/upload
router.post("/", upload.single("file"), uploadFile);

// GET /api/upload/download/:filename
router.get("/download/:filename", downloadFile);

export default router;