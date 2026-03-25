import express from "express";
import { upload } from "../config/multerConfig.js";
import { uploadFile } from "../controllers/uploadController.js";

const router = express.Router();

// POST /api/upload
router.post("/", upload.single("file"), uploadFile);

export default router;