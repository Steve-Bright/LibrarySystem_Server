import express from "express";
import { addBook, deleteBook, editBook, getAllBooks, getBook, moveImage, getLatestAccNo, searchBook } from "../controllers/book.controller.js"
import {  validateToken, isManager, validateBody } from "../utils/validator.js"
import { upload } from "../multerStorage.js"
import { BookSchema } from "../utils/data.entry.js";


const router = express.Router();

// router.post("/addBook", validateToken(),  upload.single("bookCover"), 
//             (req, res, next) => addBook(req, res, next) .then((fileDirectory) => moveImage(fileDirectory, fileName))
//         );
router.post("/addBook", validateToken(),  upload.fields([{name: "bookCover"}, {name: "barcode"}]), validateBody(BookSchema.register),
            (req, res, next) => addBook(req, res, next) .then((fileDirectory) => moveImage(fileDirectory, req.fileNames))
        );
router.post("/editBook", validateToken(), isManager(), upload.single("bookCover"), 
            (req, res, next) => editBook(req, res, next) .then((fileDirectory) => moveImage(fileDirectory, req.fileNames))
            )
// router.post("/editBook", validateToken(),  editUpload.single("bookCover"), 
//             (req, res, next) => console.log("this is the request file " + req.file)
//             )
router.get("/getAllBooks", validateToken(), getAllBooks)
router.get("/getBook", validateToken(), getBook)
router.delete('/deleteBook', validateToken(), isManager(), deleteBook)
router.get("/getLatestAccNo/:category", validateToken(), getLatestAccNo);
router.post("/searchBook", validateToken(), searchBook)

export default router;