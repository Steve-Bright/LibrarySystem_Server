import multer from 'multer';
import { kayinGyiTemp } from "./utils/directories.js"

let fileName;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, kayinGyiTemp);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        const accessionNum = req.body.accNo; // Access req.body
        fileName = accessionNum + '-' + uniqueSuffix;
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only image files are allowed"), false);
        }
        cb(null, true);
    }
});

// Export the upload middleware and fileName for use in other files
export { upload, fileName };