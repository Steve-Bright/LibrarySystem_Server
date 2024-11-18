import express from "express";
import { addBook } from "../controllers/book.controller.js"
import {  validateToken, isManager } from "../utils/validator.js"
import {moveImage} from "../utils/libby.js"
import {kayinGyiTemp } from "../utils/directories.js"
import { upload, fileName } from "../multerStorage.js"


const router = express.Router();


router.post("/addBook", validateToken(), isManager(), upload.single("bookCover"), 
            (req, res, next) => addBook(req, res, next) .then((fileDirectory) => {
                let oldPath = kayinGyiTemp + fileName;
                if(typeof fileDirectory == "string"){
                    moveImage(oldPath, fileDirectory)
                }
            })
        );

export default router;