import mmbook from "../model/mmbook.model.js"
import engbook from "../model/engbook.model.js"
import deletedbook from "../model/deletedbook.model.js"
import {fMsg, fError, paginate} from "../utils/libby.js"
import {kayinGyiBooks, kayinGyiTemp  } from "../utils/directories.js"
import {moveFile} from "../utils/libby.js"


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
            isbn,
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
            if(!isbn){
                return fError(res, "Need isbn" , 400)
            }
        }else{
            return fError(res, "Wrong category input", 400)
        }

        const sameAccNo = await bookFormat.findOne({ accNo})
        if(sameAccNo){
            return fError(res, "There is already same duplicate accession number", 400)
        }

        const sameCallNo = await bookFormat.findOne({callNo})
        if(sameCallNo){
            return fError(res, "There is already same call number", 400)
        }

        const deletedBook = await deletedbook.findOne({category})
        if(deletedBook){
            if(deletedBook.accNo != accNo){
                return fError(res, "Please fill the empty accession number: " + deletedBook.accNo, 400)
            }else if(deletedBook.accNo === accNo){
                await deletedBook.deleteOne({accNo})
            }
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
            isbn,
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
        const { 
            category,
            bookId,
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

        if(!category){
            return fError(res, "Need category to edit", 400)
        }

        if(!bookId){
            return fError(res, "Need book id to edit", 400);
        }

        let bookFormat;
        if(category == "myanmar"){
            bookFormat = mmbook
        }else if(category == "english"){
            bookFormat = engbook
        }else{
            return fError(res, "Wrong category input", 400)
        }

        const book = await bookFormat.findById(bookId);
        const bookAccNo = book.accNo;
        if(!book){
            return fError(res, "Book does not exist", 400)
        }

        const sameAccNo = await bookFormat.findOne({ accNo})
        if(sameAccNo){
            return fError(res, "There is already same duplicate accession number", 400)
        }

        const sameCallNo = await bookFormat.findOne({callNo})
        if(sameCallNo){
            return fError(res, "There is already same call number", 400)
        }
        
        let bookCover;
        let actualBookCover
        if(req.file){
            const fileName = bookAccNo + "-" + Date.now() + ".png"
            bookCover = "/KayinGyi/books/" + fileName
            actualBookCover = kayinGyiBooks + fileName;
        }

        const updatedBook = await bookFormat.findByIdAndUpdate(bookId, {
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
        }, {new: true})

        fMsg(res, "Book updated successfully", updatedBook, 200)
        return actualBookCover
    }catch(error){
        console.log("edit book error: " + error)
        next(error)
    }
}

export const getBook = async(req, res, next) => {
    try{
        const { category, bookId } = req.query;

        let bookFormat
        if(category == "myanmar"){
            bookFormat = mmbook
        }else if(category == "english"){
            bookFormat = engbook
        }else{
            return fError(res, "Wrong category input", 400)
        }

        const book = await bookFormat.findById(bookId);
        if(!book){
            return fError(res, "There is no such this book!" , 400)
        }

        fMsg(res, "Book details fetched successfully", book, 200)

    }catch(error){
        console.log("get detailed book error " + error)
        next(error)
    }
}

export const getAllBooks = async(req, res, next) => {
    try{
        const { category, page }  = req.query;
        let filter = null;
        if(!category){
            return fError(res, "Please provide the category", 400)
        }
        let bookFormat;
        if(category == "myanmar"){
            bookFormat = mmbook
        }else if(category == "english"){
            bookFormat = engbook
        }else{
            return fError(res, "Wrong category input", 400)
        }

        
        const books = await paginate(bookFormat, null, page)
        fMsg(res, "Books fetched successfully", books, 200)
    }catch(error){
        console.log("get all books error " + error)
        next(error)
    }
}

export const deleteBook = async(req, res, next) => {
    try{
        const { category, bookId }  = req.query;
        if(!bookId){
            return fError(res, "Please enter the book Id", 400)
        }

        let bookFormat;
        if(category == "myanmar"){
            bookFormat = mmbook
        }else if(category == "english"){
            bookFormat = engbook
        }else{
            return fError(res, "Wrong category input", 400)
        }

        const deletedBook = await bookFormat.findByIdAndDelete(bookId)
        if(!deletedBook){
            return fError(res, "Book not found", 200)
        }
        let accNo = deletedBook.accNo
        await (new deletedbook({category, accNo})).save()
         
        fMsg(res, "Book deleted successfully", deletedBook, 200)

    }catch(error){
        console.log("delete book error " + error )
        next(error)
    }
}

export const getLatestAccNo = async(req, res, next) => {
    try{
        const category = req.params.category;
        let bookFormat;
        if(category == "myanmar"){
            bookFormat = mmbook
        }else if(category == "english"){
            bookFormat = engbook
        }else{
            return fError(res, "Wrong category input", 400)
        }

        let accNo;
        const deletedBook = await deletedbook.findOne({category})
        if(deletedBook){
            accNo = deletedBook.accNo;
        }else{
            const latestBook = await bookFormat.findOne().sort({_id: -1})
            if(latestBook){
                let number = latestBook.accNo.split("-")
                number = Number(number[1])+1
                let totalNumber = 5;
                let finalNumber = String(number);
                for(let i = finalNumber.length; i < totalNumber; i++){
                    finalNumber = "0" + finalNumber;
                }
                
                accNo = `CC-${finalNumber}`;
            }else{
                accNo = "CC-00001"
            }   
        }

        fMsg(res, "Latest accession number", accNo, 200)
    }catch(error){
        console.log("get latest acc no error " + error)
        next(error)
    }
}

export function moveImage(directory, fileName){
    let oldPath = kayinGyiTemp + fileName;
    if(typeof directory == "string"){
        moveFile(oldPath, directory)
    }
}