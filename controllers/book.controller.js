import mmbook from "../model/mmbook.model.js"
import engbook from "../model/engbook.model.js"
import {fMsg, fError} from "../utils/libby.js"
import {kayinGyiBooks } from "../utils/directories.js"


export const addBook = async(req, res, next) => {
    try {
        const { 
            category,
            accNo, 
            bookTitle, 
            subTitle, 
            parallelTitle, 
            initial, 
            classNo, 
            callNo, 
            sor, 
            authorOne, 
            authorTwo, 
            authorThree, 
            Other, 
            translator, 
            pagniation, 
            size, 
            illustrationType, 
            seriesTitle, 
            seriesNo, 
            includeCD, 
            subjectHeadings, 
            edition, 
            editor, 
            place, 
            publisher, 
            year, 
            keywords, 
            summary, 
            notes, 
            source, 
            price, 
            donor, 
            catalogOwner
        } = req.body;

        if(!category || !accNo || !bookTitle || !initial || !classNo || !callNo || !sor){
            return fError(res, "Please enter the required field", 400)
        }


        if(!req.file){
            return fError(res, "Please upload a book cover", 400)
        }
        if(!req.file.mimetype.startsWith("image")){
            return fError(res, "Please upload the image only", 400)
        }
        
        let bookFormat;
        if(category == "myanmar"){
            bookFormat = mmbook
        }else if(category == "english"){
            bookFormat = engbook
        }

        const sameAccNo = await bookFormat.findOne({ accNo, deleted: false})
        if(sameAccNo){
            return fError(res, "There is already same duplicate accession number", 400)
        }

        const sameCallNo = await bookFormat.findOne({callNo})
        if(sameCallNo){
            return fError(res, "There is already same call number", 400)
        }

        const fileName = accNo + "-" + Date.now() + ".png"
        const bookCover = "/KayinGyi/books/" + fileName
        const actualBookCover = kayinGyiBooks + fileName;


        const newBook = new bookFormat({
            accNo, 
            bookTitle, 
            subTitle, 
            parallelTitle, 
            initial, 
            classNo, 
            callNo, 
            bookCover,
            sor, 
            authorOne, 
            authorTwo, 
            authorThree, 
            Other, 
            translator, 
            pagniation, 
            size, 
            illustrationType, 
            seriesTitle, 
            seriesNo, 
            includeCD, 
            subjectHeadings, 
            edition, 
            editor, 
            place, 
            publisher, 
            year, 
            keywords, 
            summary, 
            notes, 
            source, 
            price, 
            donor, 
            catalogOwner
        });

        await newBook.save();

        fMsg(res, "Book added succcessfully", newBook, 200)
        return actualBookCover;
    } catch (error) {
        console.log("add book error: " + error)
        next(error);
    }
}

export const editBook = async(req, res, next) => {
    try{

    }catch(error){
        console.log("edit book error: " + error)
        next(error)
    }
}

export const getBook = async(req, res, next) => {
    try{

    }catch(error){
        console.log("get book error " + error)
        next(error)
    }
}