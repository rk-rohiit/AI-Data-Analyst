import { error } from 'console';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

// file filter (only csv)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "text/csv") {
        cb(null, true);
    } else {
        cb(new error("Only csv file allowed"), false);
    }
};

export const upload = multer({ storage, fileFilter });