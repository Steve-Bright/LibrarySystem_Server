import loanModel from "../model/loan.model.js";
import cron from "node-cron";
import mmbook from "../model/mmbook.model.js";
import engbook from "../model/engbook.model.js";
import member from "../model/member.model.js"
import {fMsg, fError, paginate, todayDate} from "../utils/libby.js"

export const addLoan = async(req, res, next) => {
    try{
        const { category, bookId, memberId } = req.body;
        if(!category || !bookId || !memberId){
            return fError(res, "Please enter the category, book and member Ids")
        }

        let bookFormat;
        let bookModel;
        if(category == "myanmar"){
            bookModel = "mmbook"
            bookFormat = mmbook
        }else if(category == "english"){
            bookFormat = engbook
            bookModel = "engbook"
        }else{
            return fError(res, "Wrong category input", 400)
        }

        const loanBook = await bookFormat.findById(bookId)
        if(!loanBook){
            return fError(res, "Book is not found")
        }

        const memberFound = await member.findById(memberId)
        if(memberFound.block == true){
            return fError(res, "Member is banned, can't lend ")
        }

        if(memberFound.loanBooks == 3){
            return fError(res, "You cannot loan more than 3 books")
        }else{
            if(loanBook.loanStatus == true){
                return fError(res, "The book is already loaned")
            }else{
                loanBook.loanStatus = true
                memberFound.loanBooks ++;   
                await memberFound.save();
                await loanBook.save()
            }
        }
        let memberType = memberFound.memberType

        let duration; 
        let dueDate;
        switch (memberType) {
            case "student": 
                duration = "1 week";
                dueDate = todayDate(7)
                break;
            case "staff": 
            case "teacher": 
                duration =  "2 week"
                dueDate = todayDate(14)
                break;
            default: 
            return fError(res, "Something went wrong with memberType")
        }

        let loanDate = todayDate()
        let loanStatus = true;
        
        const bookLoan = await loanModel.create({
            memberId,
            bookId,
            bookModel,
            loanDate,
            dueDate,
            duration,
            loanStatus
        })

        // const overdueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
        

        fMsg(res, "Book is loaned", bookLoan, 200)
        
        
    }catch(error){
        console.log("add loan error " + error)
        next(error)
    }
}

export const returnLoan = async(req, res, next) => {
    try{
        const loanId = req.params.loanId;
        if(!loanId){
            return fError(res, "Please enter the required field")
        }

        const loanBook =await loanModel.findById(loanId)
        if(!loanId){
            return fError(res, "Loan not found", 404)
        }

        let bookFormat;
        if(loanBook.bookModel == "engbook"){
            bookFormat = engbook
        }else if(loanBook.bookModel == "mmbook"){
            bookFormat = mmbook
        }
        
        await bookFormat.findByIdAndUpdate(loanBook.bookId, {loanStatus: false})

        loanBook.loanStatus = false;
        await loanBook.save();

        fMsg(res, "Book returned successfully", loanBook, 200)

    }catch(error){
        console.log("return loan error " + error)
        next(error)
    }
}

export const checkLoan = async(req, res, next) => {
    try{
        const overdueLoans = await loanModel.find({dueDate: {$lt: todayDate()}, loanStatus: true})
        for(const eachOverdue of overdueLoans){
            if(eachOverdue.overdue == false){
                await loanModel.findByIdAndUpdate(eachOverdue._id, {overdue: true})
            }
            
        }
        fMsg(res, "Overdued loans ", overdueLoans, 200)
    }catch(error){
        console.log("check loan error " + error);
        next(error);
    }
}

export const extendLoan = async(req, res, next) => {
    try{

    }catch(error){
        console.log('extend loan error ' + error)
        next(error)
    }
}

export const deleteLoan = async(req, res, next) => {
    try{
        const loanId = req.params.loanId;
        if(!loanId){
            return fError(res, "Please enter the required field")
        }

        const deletedLoan = await loanModel.findByIdAndDelete(loanId)
        if(!deletedLoan){
            return fError(res, "Loan not found",)
        }

        fMsg(res, "Loan deleted successfully", deletedLoan, 200)
    }catch(error){
        console.log("delete loan error " + error)
        next(error)
    }
}

export const searchLoan = async(req, res, next) => {
    try{
        const {accNo, memberId, bookTitle, name, loanDate, dueDate} = req.body;

        if(!accNo && !memberId && !bookTitle && !name && !loanDate && !dueDate) {
            return fError(res, "Please specify the fields")
        }

        let memberFields = {};
        let bookFields = {}

        if(accNo){
            bookFields["accNo"] = { $regex: accNo, $options: "i" }
        }

        if(memberId){
            memberFields["memberId"] = { $regex: memberId, $options: "i" }
        }

        if(bookTitle){
            bookFields["bookTitle"] = { $regex: bookTitle, $options: "i" }
        }

        if(name){
            memberFields["name"] = { $regex: name, $options: "i" }
        }

        let combineBooks = [];
        if(bookFields != {}){
            let engBooks = await engbook.find(bookFields).exec()
            let mmBooks = await mmbook.find(bookFields).exec()

            
            if(engBooks.length > 0){
                for(let eachEngBook of engBooks){
                    combineBooks.push(eachEngBook._id)
                }
            }

            if(mmBooks.length > 0){
                for(let eachMmBook of mmBooks){
                    combineBooks.push(eachMmBook._id)
                }
            }

        }

        let memberFound;
        let memberIds = []
        if(memberFields != {}){
            memberFound = await member.find(memberFields).exec()
            for(let eachMember of memberFound){
                memberIds.push(eachMember)
            }
        }
        let loanQuery = {};
        if (combineBooks.length > 0) {
            loanQuery["bookId"] = { $in: combineBooks };
        }
        if (memberIds.length > 0) {
            loanQuery["memberId"] = { $in: memberIds };
        }

        const loans = await loanModel.find(loanQuery).exec();

        fMsg(res, "This is the loan you searched", loans, 200)
        
    }catch(error){
        console.log("search loan error " + error)
        next(error)
    }
}