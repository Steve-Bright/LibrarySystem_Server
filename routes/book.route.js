import express from "express";
import { addBook, deleteBook, editBook, getAllBooks, getBook, moveImage, getLatestAccNo, searchBook, deleteImage, editImage, getBookLoanHistory, numOfBooks, getBookDataCSV, getLatestLoan, generateBarcodeTest, deleteTempFiles } from "../controllers/book.controller.js"
import {  validateToken, isManager, validateBody } from "../utils/validator.js"
import { upload, csvUpload } from "../multerStorage.js"
import { BookSchema } from "../utils/data.entry.js";


const router = express.Router();

router.post("/addBook", validateToken(),  upload.fields([{name: "bookCover"}, {name: "barcode"}]), validateBody(BookSchema.register),
            (req, res, next) => addBook(req, res, next) .then((fileDirectory) => moveImage(fileDirectory, req.fileNames))
        );
router.post("/editBook", validateToken(), isManager(), upload.single("bookCover"), validateBody(BookSchema.edit),
            (req, res, next) => editBook(req, res, next) .then((fileDirectory) => editImage(fileDirectory, req.fileNames))
            )
// router.patch("/editBook", validateToken(), isManager(), upload.single("bookCover"), validateBody(BookSchema.edit),
//             (req, res, next) => editBook(req, res, next) .then((fileDirectory) => editImage(fileDirectory, req.fileNames))
//             )
// router.post("/editBook", validateToken(),  editUpload.single("bookCover"), 
//             (req, res, next) => console.log("this is the request file " + req.file)
//             )
router.get("/getAllBooks", validateToken(), getAllBooks)
router.get("/allLoans/:bookId", validateToken(), getBookLoanHistory)
router.get("/getBook", validateToken(), getBook)
router.delete('/deleteBook', validateToken(), isManager(), (req, res, next) => deleteBook(req, res, next).then((fileNames) => deleteImage(fileNames)))
router.get("/getLatestAccNo/:category", validateToken(), getLatestAccNo);
router.post("/searchBook", validateToken(), searchBook)
router.get("/totalNum/:duration", validateToken(), numOfBooks);
router.get("/latestLoan", validateToken(), getLatestLoan)
router.post("/importData", validateToken(), csvUpload.single("csvFile"), getBookDataCSV)
router.post("/testBarcode", validateToken(), generateBarcodeTest)
router.get("/deleteTemp", deleteTempFiles)

export default router;