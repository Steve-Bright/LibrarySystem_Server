import mmbook from "../model/mmbook.model.js"
import engbook from "../model/engbook.model.js"
import Loan from "../model/loan.model.js"
import csvParser from "csv-parser"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import deletedbook from "../model/deletedbook.model.js"
import {fMsg, fError, paginate, getWeeklyDates, getMonthlyDates} from "../utils/libby.js"
import {kayinGyiBooks, kayinGyiBooksBarcode, kayinGyiTemp, homeDirectory, kayinGyiCSVFile  } from "../utils/directories.js"
import { mapBook } from "../utils/model.mapper.js"
import {moveFile, deleteFile} from "../utils/libby.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
            other, 
            translator, 
            pagination, 
            size, 
            illustrationType, 
            seriesTitle, 
            seriesNo, 
            includeCD, 
            subjectOne, 
            subjectTwo,
            subjectThree,
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


        if(!req.files.bookCover){
            return fError(res, "Please upload a book cover", 400)
        }
        // console.log("this is thhe req file " + JSON.stringify(req.files))
        if(!req.files.bookCover[0].mimetype.startsWith("image")){
            return fError(res, "Please upload the image only", 400)
        }
        
        let bookFormat;
        switch(category){
            case "myanmar": bookFormat = mmbook;
                            break;
            case "english": bookFormat = engbook;
                            break;
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
        const barcodeName = accNo + "-barcode-" + Date.now() + ".png"
        const bookCover = "/KayinGyi/books/" + fileName
        const barcode = "/KayinGyi/booksBarcodes/" + barcodeName
        const actualBookCover = kayinGyiBooks + fileName;
        const actualBookBarcode = kayinGyiBooksBarcode + barcodeName

        const bookData = mapBook({
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
            other, 
            translator, 
            pagination, 
            size, 
            illustrationType, 
            seriesTitle, 
            seriesNo, 
            includeCD, 
            subjectOne, 
            subjectTwo,
            subjectThree, 
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
            catalogOwner,
            barcode
        })

        const newBook = new bookFormat(bookData);

        await newBook.save();

        fMsg(res, "Book added succcessfully", newBook, 200)
        return [actualBookCover, actualBookBarcode];
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
            isbn,
            authorOne, 
            authorTwo, 
            authorThree, 
            other, 
            translator, 
            pagination, 
            size, 
            illustrationType, 
            seriesTitle, 
            seriesNo, 
            includeCD, 
            subjectOne, 
            subjectTwo,
            subjectThree,
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
            catalogOwner,
            editedPhoto
        } = req.body;


        let bookFormat;
        switch(category){
          case "myanmar": bookFormat = mmbook;
                          break;
          case "english": bookFormat = engbook;
                          break;
        }

        const book = await bookFormat.findById(bookId);
        if(!book){
            return fError(res, "Book does not exist", 400)
        }
        const bookAccNo = book.accNo;

        if(accNo){
            const sameAccNo = await bookFormat.findOne({accNo: null})
            if(sameAccNo){
                return fError(res, "There is already same duplicate accession number", 400)
            }
        }

        const sameCallNo = await bookFormat.findOne({callNo})
        if(sameCallNo){
            return fError(res, "There is already same call number", 400)
        }
        
        let bookCover;
        let actualBookCover;
        let oldBookCover
        console.log("this is req files " + JSON.stringify(req.file))
        if(editedPhoto && req.file){
            const fileName = bookAccNo + "-" + Date.now() + ".png"
            bookCover = "/KayinGyi/books/" + fileName
            actualBookCover = kayinGyiBooks + fileName;
            const bookFound = await bookFormat.findById(bookId)
            oldBookCover = homeDirectory + bookFound.bookCover;
        }

        const bookData = mapBook({
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
            other, 
            translator, 
            pagination, 
            size, 
            illustrationType, 
            seriesTitle, 
            seriesNo, 
            includeCD, 
            subjectOne, 
            subjectTwo,
            subjectThree,
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
        })

        const updatedBook = await bookFormat.findByIdAndUpdate(bookId, bookData, {new: true})

        fMsg(res, "Book updated successfully", updatedBook, 200)
        console.log("This is old book cover " + oldBookCover)
        console.log("This is actual book cover " + actualBookCover)
        return [oldBookCover, actualBookCover]
    }catch(error){
        console.log("edit book error: " + error)
        next(error)
    }
}

export const getBook = async(req, res, next) => {
    try{
        const { category, bookId, accNo } = req.query;

        if(!category){
            return fError(res, "Please specify the category", 200)
        }else{
            if(!bookId && !accNo){
                return fError(res, "Please enter the specific bookId you want to search")
            }
        }

        let bookFormat
        if(category == "myanmar"){
            bookFormat = mmbook
        }else if(category == "english"){
            bookFormat = engbook
        }else{
            return fError(res, "Wrong category input", 400)
        }
        
        let bookData = {category}

        if(bookId){
            bookData["_id"] = bookId
        }

        if(accNo){
            bookData["accNo"] = accNo
        }

        const book = await bookFormat.findOne(bookData);
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

        
        const books = await paginate(bookFormat, null, page, 10,"createdAt")
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
        
        const actualBookCover = homeDirectory + deletedBook.bookCover;
        const actualBookBarcode = homeDirectory + deletedBook.barcode
        fMsg(res, "Book deleted successfully", deletedBook, 200)
        return [actualBookBarcode, actualBookCover]
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
                // let number = latestBook.accNo.split("-")
                let number = Number(latestBook.accNo)+1
                let totalNumber = 6;
                let finalNumber = String(number);
                for(let i = finalNumber.length; i < totalNumber; i++){
                    finalNumber = "0" + finalNumber;
                }
                
                accNo = finalNumber;
            }else{
                accNo = "000001"
            }   
        }

        fMsg(res, "Latest accession number", accNo, 200)
    }catch(error){
        console.log("get latest acc no error " + error)
        next(error)
    }
}

const innerLatestAccNo = async(category, numberIndex) => {
    try{

        let bookFormat;
        if(category == "myanmar"){
            bookFormat = mmbook
        }else if(category == "english"){
            bookFormat = engbook
        }

        let accNo;
            const latestBook = await bookFormat.findOne().sort({_id: -1})
            if(latestBook){
                // let number = latestBook.accNo.split("-")
                let number = Number(latestBook.accNo)+1 + numberIndex
                let totalNumber = 6;
                let finalNumber = String(number);
                for(let i = finalNumber.length; i < totalNumber; i++){
                    finalNumber = "0" + finalNumber;
                }
                
                accNo = finalNumber;
                console.log("latest book come on dnfadnfnasd;fj " + number)
            }else{
                accNo = "000001"
            }   
        

        return {accNo, numberIndex};
    }catch(error){
        console.log("inner latest acc no error " + error)
    }
}

export const searchBook = async(req, res, next) => {
    try{

        const {category, accNo, bookTitle, sor, publisher, classNo, isbn} = req.body;

        if(!category){
            return fError(res, "Please enter  the required field")
        }

        if(!accNo && !bookTitle && !sor && !publisher && !classNo && !isbn){
            return fError(res, "Please enter the specifc fields ")
        }

        let searchFields = {}

        if(accNo){
            searchFields["accNo"] = accNo
        }
        if(isbn){
            searchFields["isbn"] = {$regex: isbn, $options: "i"}
        }
        if(bookTitle){
            searchFields["bookTitle"] = { $regex: bookTitle, $options: 'i' };
        }
        if(sor){
            searchFields["sor"] = { $regex: sor, $options: 'i' };
        }
        if(publisher){
            searchFields["publisher"] = { $regex: publisher, $options: 'i' };
        }
        if(classNo){
            searchFields["classNo"] = { $regex: classNo, $options: 'i' };
        }

        let bookFormat;
        if(category == "myanmar"){
            bookFormat = mmbook
        }else if(category == "english"){
            bookFormat = engbook
        }else{
            return fError(res, "Wrong category input", 400)
        }

        const bookFound = await bookFormat.find(searchFields)
        if(bookFound.length === 0){
            return fError(res, "Book not found")
        }
        fMsg(res, "This is the book found", bookFound, 200)

    }catch(error){
        console.log("search book error " + error)
        next(error)
    }
}

export const getBookLoanHistory = async(req, res, next) =>{
  try{
    const bookId = req.params.bookId;
    const loanHistories = await Loan.find({bookId})
            .populate("bookId", "bookTitle category")
            .populate("memberId", "memberId name")

    fMsg(res, "Loan History", loanHistories, 200)

  }catch(error){
    console.log("get book loan history error " + error)
    next(error)
  }
}

export const getBookDataCSV = async (req, res, next) => {
    try{
        if(!req.file){
            return fError(res, "Need csv file", 400)
        }

        let {category} = req.body;
        let bookFormat;

        const bookFields = {
            "Accession-Number": "accNo",
            "Book-Title": "bookTitle",
            "Sub-Title": "subTitle",
            "Parallel-Title": "parallelTitle",
            "Initial": "initial",
            "Class-Num": "classNo",
            "Call-Num": "callNo",
            "SOR": "sor",
            "Author-One": "authorOne",
            "Author-Two": "authorTwo",
            "Author-Three": "authorThree",
            "Other": "other",
            "Translator": "translator",
            "Pagination": "pagination",
            "Size": "size",
            "Illustration-Type": "illustrationType",
            "Series-Title": "seriesTitle",
            "Series-No": "seriesNo",
            "Include-CD": "includeCD",
            "Subject-One": "subjectOne", 
            "Subject-Two": "subjectTwo",
            "Subject-Three": "subjectThree",
            "Edition": "edition",
            "Editor": "editor",
            "Place": "place",
            "Publisher": "publisher",
            "Year": "year",
            "Keywords": "keywords",
            "Summary": "summary",
            "Notes": "notes",
            "Source": "source",
            "Price": "price",
            "Donor": "donor",
            "Catalog-Owner": "catalogOwner"
        };

        if(category === "myanmar"){
            bookFields["ISBN"] = "isbn";
            bookFormat = mmbook
        }else{
            bookFormat = engbook;
        }
        
        let bookKeys = Object.keys(bookFields)

        const requiredFields = ["accNo", "bookTitle", "classNo", "callNo", "sor", "isbn", "initial"]
        

        const dummyImagePath = path.join(__dirname, "blank_book.jpg");
        let results = []
        let promises = []

        let accNumberIndex = -1;
        let callNumberIndex = 0;
        fs.createReadStream(req.file.path)
        .pipe(csvParser({
            mapHeaders: ({ header, index }) => {
                for(let i = 0; i < bookKeys.length; i++){
                    if(header === bookKeys[i]){
                        return bookFields[bookKeys[i]]
                    }
                }
            },
            delimiter: ',,,'
        }))
        .on("data", async(data) => {
            let promise = (async () => {
                for(let field of requiredFields){
                    if(!data[field]){
                       if(field === "accNo"){
                        let number = await innerLatestAccNo(category, accNumberIndex)
                        data[field] = number.accNo;
                        console.log("number index " + number.numberIndex)
                        // accNumberIndex = number.numberIndex

                       }else if(field === "callNo"){
                        let accessionNumber = data["accNo"] || "AccNo " + callNumberIndex
                        let initial = data["initial"] || "Intial"
                        let classNumber = data["classNo"] || "Class"
                        data[field] = `${accessionNumber} ${initial} ${classNumber}`
                        callNumberIndex += 1;
                       }
                       else{
                        data[field] = "N/A"
                       }
                    }
                }
                data.bookCover = dummyImagePath
                results.push(data)
            })();
            promises.push(promise)
            // for(let field of requiredFields){
            //     if(!data[field]){
            //        if(field === "accNo"){
            //         data[field] = await innerLatestAccNo(category)
            //        }else{
            //         data[field] = "N/A"
            //        }
            //     }
            // }
            // data.bookCover = dummyImagePath

        })
        .on("end", async() => {
            await Promise.all(promises); 
            // console.log("these are results" + JSON.stringify(results))
            await bookFormat.insertMany(results, {"ordered": false})
        })

        fMsg(res, "Data imported successfully", results, 200)
        
    }catch(error){
        console.log("get book data csv error " + error)
        next(error)
    }
}

export const numOfBooks = async(req, res, next) => {
    try{
        const duration = req.params.duration
        let adjustDate;

        switch (duration){
            case "weekly": 
                adjustDate = {createdAt: {$gte: getWeeklyDates().startOfWeek}}
                break;
            case "monthly":
                adjustDate =  {createdAt: {$gte: getMonthlyDates().startOfMonth}}
                break;
            case "all":
                adjustDate = {}
                break;
        }
        let totalBooks = {};
        let mmbooks = await mmbook.countDocuments(adjustDate);
        let engbooks = await engbook.countDocuments(adjustDate)

        totalBooks = {total: (mmbooks+engbooks), mm: mmbooks, eng: engbooks}
        fMsg(res, "Total Number of books", totalBooks, 200)

    }catch(error){
        console.log("error number of books " + error)
        next(error)
    }
}

export function moveImage(directory, fileNames){
    if(directory && fileNames){
        for(let i = 0; i < fileNames.length; i++){
            let oldPath = kayinGyiTemp + fileNames[i]
            if(typeof directory[i] == "string"){
                moveFile(oldPath, directory[i])
            }
        }
    }
    
}

export function deleteImage(fileNames){
    console.log("filenames for delete " + fileNames)
    for(let eachFile of fileNames){
        let deleteResult = deleteFile(eachFile)
        if(deleteResult){
            console.log("deleted successfully")
        }
    }
}

export function editImage(fileNames, editedFile){
    if(fileNames && editedFile){
        let oldBookCover = fileNames[0]
    let newBookCover = fileNames[1]

    for(let i = 0; i < editedFile.length; i++){
        let tempPath = kayinGyiTemp + editedFile[i]
        if(typeof newBookCover == "string"){
            let moveResult = moveFile(tempPath, newBookCover)
            if(moveResult){
                console.log("File is edited successfully!")
                deleteFile(oldBookCover)
            }
        }
    }
    }
    

}