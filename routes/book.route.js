import express from "express";
import { addBook, deleteBook, getBook } from "../controllers/book.controller.js"
import {  validateToken, isManager } from "../utils/validator.js"
import {moveImage} from "../utils/libby.js"
import {kayinGyiTemp } from "../utils/directories.js"
import { upload, fileName } from "../multerStorage.js"


const router = express.Router();


router.post("/addBook", validateToken(),  upload.single("bookCover"), 
            (req, res, next) => addBook(req, res, next) .then((fileDirectory) => {
                let oldPath = kayinGyiTemp + fileName;
                if(typeof fileDirectory == "string"){
                    moveImage(oldPath, fileDirectory)
                }
            })
        );

router.get("/getBook", validateToken(), getBook)
router.delete('/deleteBook', validateToken(), isManager(), deleteBook)

export default router;