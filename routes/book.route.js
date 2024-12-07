import express from "express";
import { addBook, deleteBook, editBook, getAllBooks, getBook, moveImage, getLatestAccNo } from "../controllers/book.controller.js"
import {  validateToken, isManager } from "../utils/validator.js"
import { upload } from "../multerStorage.js"



const router = express.Router();

// router.post("/addBook", validateToken(),  upload.single("bookCover"), 
//             (req, res, next) => addBook(req, res, next) .then((fileDirectory) => moveImage(fileDirectory, fileName))
//         );
router.post("/addBook", validateToken(),  upload.fields([{name: "bookCover"}, {name: "barcode"}]), 
            (req, res, next) => addBook(req, res, next) .then((fileDirectory) => moveImage(fileDirectory, req.fileNames))
        );
router.post("/editBook", validateToken(), isManager(), upload.single("bookCover"), 
            (req, res, next) => editBook(req, res, next) .then((fileDirectory) => moveImage(fileDirectory, req.fileNames))
            )
router.get("/getAllBooks", validateToken(), getAllBooks)
router.get("/getBook", validateToken(), getBook)
router.delete('/deleteBook', validateToken(), isManager(), deleteBook)
router.get("/getLatestAccNo/:category", validateToken(), getLatestAccNo);

export default router;