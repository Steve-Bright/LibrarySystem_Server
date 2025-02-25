import multer from 'multer';
import { kayinGyiCSVFile, kayinGyiTemp } from "./utils/directories.js"

// let fileName = [];

const csvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, kayinGyiCSVFile);
    },
    filename: (req, file, cb) => {
        console.log(file.originalname)
        cb(null, file.originalname);
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, kayinGyiTemp);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        const accessionNum = req.body.accNo; // Access req.body
        const generatedName  = accessionNum + '-' + uniqueSuffix;
        // fileName.push(generatedName)
        if(!req.fileNames) req.fileNames = []
        req.fileNames.push(generatedName)
        cb(null, generatedName);
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

const csvUpload = multer({
    storage: csvStorage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["text/csv", "application/vnd.ms-excel"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Either CSV files or Excel files are allowed"), false);
        }
        cb(null, true);
    }
})

// Export the upload middleware and fileName for use in other files
export { upload, csvUpload};
