import multer from "multer";
import path from "path";

// storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// file filter (CSV, TSV, TXT, TAB)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".csv", ".tsv", ".txt", ".tab"];
  const allowedMimeTypes = [
    "text/csv",
    "text/tab-separated-values",
    "text/plain",
    "application/vnd.ms-excel",
    "application/octet-stream",
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedExtensions.includes(ext) ||
    allowedMimeTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only tabular dataset files (.csv, .tsv, .txt, .tab) are allowed"), false);
  }
};

export const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});