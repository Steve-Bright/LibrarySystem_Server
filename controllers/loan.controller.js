import loanModel from "../model/loan.model.js";
import cron from "node-cron";
import mmbook from "../model/mmbook.model.js";
import engbook from "../model/engbook.model.js";
import member from "../model/member.model.js"
import {fMsg, fError, paginate, todayDate, getWeeklyDates, getMonthlyDates} from "../utils/libby.js"

export const addLoan = async(req, res, next) => {
    try{
        const { category, bookDatabaseId, memberDatabaseId } = req.body;
        if(!category || !bookDatabaseId || !memberDatabaseId){
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

        const loanBook = await bookFormat.findById(bookDatabaseId)
        if(!loanBook){
            return fError(res, "Book is not found")
        }

        const memberFound = await member.findById(memberDatabaseId)
        if(memberFound.block == true){
            return fError(res, "Member is banned, can't lend ")
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
            case "public":
                duration =  "2 week"
                dueDate = todayDate(14)
                break;
            default: 
            return fError(res, "Something went wrong with memberType")
        }

        let loanDate = todayDate()

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
        
        const bookLoan = await loanModel.create({
            memberDatabaseId,
            bookDatabaseId,
            category: loanBook.category,
            accNo: loanBook.accNo,
            callNo: loanBook.callNo,
            bookTitle: loanBook.bookTitle,
            bookCover: loanBook.bookCover,
            memberId: memberFound.memberId,
            name: memberFound.name,
            memberType: memberFound.memberType,
            phone: memberFound.phone,
            photo: memberFound.photo,
            bookModel,
            loanDate,
            dueDate,
            duration,
            loanStatus: true
        })

        await bookFormat.findByIdAndUpdate(bookDatabaseId, {latestLoanId: bookLoan._id})
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
        if(!loanBook){
            return fError(res, "Loan not found", 404)
        }

        let bookFormat;
        if(loanBook.bookModel == "engbook"){
            bookFormat = engbook
        }else if(loanBook.bookModel == "mmbook"){
            bookFormat = mmbook
        }
        
        if(loanBook.bookDatabaseId){
            await bookFormat.findByIdAndUpdate(loanBook.bookDatabaseId, {loanStatus: false})
        }

        if(loanBook.memberDatabaseId){
            await member.findByIdAndUpdate(loanBook.memberDatabaseId, { $inc: {loanBooks: -1}})
        }

        loanBook.returnDate = todayDate()
        loanBook.loanStatus = false;
        loanBook.overdue = false;
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
        const loanId = req.params.loanId

        let loanFound = await loanModel.findById(loanId)
        if(!loanFound){
            return fError(res, "Loan is not found", 404)
        }

        if(todayDate() != loanFound.dueDate && todayDate(1) != loanFound.dueDate && todayDate() < loanFound.dueDate){
            return fError(res, "You are not allowed to extend before due date", 400)
        }

        let memberType = loanFound.memberType;
        let loanDuration = loanFound.duration.split(" ")
        let duration;
        let dueDate;
        switch (memberType) {
            case "student": 
                duration = `${Number(loanDuration[0]) + 1} weeks`;
                dueDate = todayDate(7)
                break;
            case "staff": 
            case "teacher":
            case "public" :
                duration = `${Number(loanDuration[0]) + 2} weeks`;
                dueDate = todayDate(14)
                break;
            default: 
            return fError(res, "Something went wrong with memberType")
        }

        if(loanFound.overdue){
            loanFound.overdue = false;
            await loanFound.save();
        }
        
        const extendedLoan = await loanModel.findByIdAndUpdate(loanId, {
            duration,
            dueDate
        })

        fMsg(res, 'Loan extended successfully', extendedLoan, 200)

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
        const {loanType = 'all'} = req.query;
        const {accNo, memberId, bookTitle, name, loanDate, dueDate} = req.body;

        if(!accNo && !memberId && !bookTitle && !name && !loanDate && !dueDate) {
            return fError(res, "Please specify the fields")
        }

        // let memberFields = {};
        // let bookFields = {}


        // if(accNo){
        //     bookFields["accNo"] = { $regex: accNo, $options: "i" }
        // }

        // if(memberId){
        //     memberFields["memberId"] = { $regex: memberId, $options: "i" }
        // }

        // if(bookTitle){
        //     bookFields["bookTitle"] = { $regex: bookTitle, $options: "i" }
        // }

        // if(name){
        //     memberFields["name"] = { $regex: name, $options: "i" }
        // }

        // let combineBooks = [];
        // if(bookFields != {}){
        //     let engBooks = await engbook.find(bookFields).exec()
        //     let mmBooks = await mmbook.find(bookFields).exec()

            
        //     if(engBooks.length > 0){
        //         for(let eachEngBook of engBooks){
        //             combineBooks.push(eachEngBook._id)
        //         }
        //     }

        //     if(mmBooks.length > 0){
        //         for(let eachMmBook of mmBooks){
        //             combineBooks.push(eachMmBook._id)
        //         }
        //     }

        //     if(engBooks.length == 0 && mmBooks.length == 0){
        //         return fError(res, "Loan not found with such book name ", 400)
        //     }

        // }

        // let memberFound;
        // let memberIds = []
        // if(memberFields != {}){
        //     memberFound = await member.find(memberFields).exec()
        //     if(!memberFound || memberFound.length === 0){
        //         return fError(res, "Loan not found with such name", 400)
        //     }
        //     for(let eachMember of memberFound){
        //         memberIds.push(eachMember)
        //     }
        // }
        let loanQuery = {};

        switch(loanType){
            case "today": loanQuery = {dueDate: todayDate(), loanStatus: true}
            break;
            case "overdue": loanQuery = { dueDate: { $lt: todayDate() }, loanStatus: true }
            break;
            case "other": loanQuery = { dueDate: {$gt: todayDate()}, loanStatus: true }
            break;
            default: loanQuery = {}
            break;
        }

        if(accNo){
            loanQuery["accNo"] = { $regex: accNo, $options: "i" }
        }

        if(memberId){
            loanQuery["memberId"] = { $regex: memberId, $options: "i" }
        }

        if(bookTitle){
            loanQuery["bookTitle"] = {$regex: bookTitle, $options: "i"}
        }

        if(name){
            loanQuery["name"] = {$regex: name, $options: "i"}
        }
        // if (combineBooks.length > 0) {
        //     loanQuery["bookId"] = { $in: combineBooks };
        // }
        // if (memberIds.length > 0) {
        //     loanQuery["memberId"] = { $in: memberIds };
        // }

        const loans = await loanModel.find(loanQuery)
        // .populate("memberId", "name memberType phone memberId")
        // .populate("bookId", "category callNo bookTitle")
        // .exec();

        fMsg(res, "This is the loan you searched", loans, 200)
        
    }catch(error){
        console.log("search loan error " + error)
        next(error)
    }
}

export const getAllLoans = async(req, res, next) => {
    try{
        const {loanType = "all", page} = req.query;
        let sortField = "dueDate";
        let filter = {};

        switch(loanType){
            case "today": filter = {dueDate: todayDate(), loanStatus: true}
            break;
            case "overdue": filter = { dueDate: { $lt: todayDate() }, loanStatus: true }
            break;
            case "other": filter = { dueDate: {$gt: todayDate()}, loanStatus: true }
            break;
            default: filter = {}
            break;
        }

        // let populate = {
        //     memberId: "name memberType phone memberId",
        //     bookId: "category callNo bookTitle"
        // }

        // const populateString = Object.entries(populate).map(
        //     ([path, select]) => ({
        //         path,
        //         select,
        //     })
        // );


        const loans = await paginate(
            loanModel, 
            filter, 
            page,
            10,
            sortField
            // populateString
        );
        fMsg(res, "All Loans", loans, 200)
    }catch(error){
        console.log("get all loans error " + error)
        next(error)
    }
}

export const getWeeklyLoans = async(req, res, next) => {
    try{
        const weeklyLoans = await loanModel
        .find({
            loanDate: {
                $gte: getWeeklyDates().startOfWeek,
                // $lte: getWeeklyDates().endOfWeek
            }
        })

        fMsg(res, "Weekly Loans", weeklyLoans, 200)
    }catch(error){
        console.log("get weekly loans error " + error)
        next(error)
    }
}

export const getMonthlyLoans = async(req, res, next) => {
    try{
        const monthlyLoans = await loanModel
        .find({
            loanDate: {
                $gte: getMonthlyDates().startOfMonth
            }
        })

        fMsg(res, "Weekly Loans", monthlyLoans, 200)
    }catch(error){
        console.log("get monthly loans error " + error)
        next(error)
    }
}

export const numOfLoans = async(req, res, next) => {
    try{
        const duration = req.params.duration;
        let adjustDate;
        let allLoans;

        switch (duration){
            case "weekly": 
                allLoans = {createdAt: {$gte: getWeeklyDates().startOfWeek}}
                adjustDate = {dueDate: {$gte: getWeeklyDates().startOfWeek, $lt: getWeeklyDates().endOfWeek}}
                break;
            case "monthly":
                allLoans = {createdAt: {$gte: getMonthlyDates().startOfMonth}}
                adjustDate = {dueDate: {$gte: getMonthlyDates().startOfMonth, $lt: getMonthlyDates().endOfMonth}}
                break;
            case "all":
                adjustDate = {}
                break;
        }
        let totalLoans = await loanModel.countDocuments(allLoans)
        let returnFields = {...adjustDate}
        returnFields["loanStatus"] = true;
        let toReturns = await loanModel.countDocuments(returnFields)

        let overDueField = {...adjustDate};
        overDueField["overdue"] = true;
        let overdueLoans = await loanModel.countDocuments(overDueField)

        let total = {newLoans: totalLoans, overdue: overdueLoans, toReturn: toReturns}
        fMsg(res, "Total Number of Loans ", total, 200)
    }catch(error){
        console.log("number of loans error "+ error)
        next(error)
    }
}

export const getLoanDetail = async(req, res, next) => {
    try{
        const loanId = req.params.loanId
        if(!loanId){
            return fError(res, "Please enter the required field")
        }

        const loanDetail = await loanModel
                                .findById(loanId)
        if(!loanDetail){
            return fError(res, "Loan not found", 404)
        }

        fMsg(res, "Loan detail", loanDetail, 200)
    }catch(error){
        console.log("get loan detail error " + error)
        next(error)
    }
}

export const getTodayDeadlineLoan = async(req, res, next) => {
    try{
        const todayLoans = await loanModel.find({dueDate: todayDate(), loanStatus: true})
        fMsg(res, "Today deadline's Loans", todayLoans, 200) 
    }catch(error){
        console.log("get today deadline loan error " + error)
        next(error)
    }
}

export const getLoanHistory = async(req, res, next) => {
    try{
        const {memberDatabaseId, bookDatabaseId, page} = req.query
        
        let filter = {}
        if(!memberDatabaseId && !bookDatabaseId){
            return fError(res, "Need at least one value to check history")
        }

        if(memberDatabaseId){
            filter["memberDatabaseId"] = memberDatabaseId
        }else if(bookDatabaseId){
            filter["bookDatabaseId"] = bookDatabaseId
        }

        // let populate = {
        //     memberId: "name memberType phone memberId",
        //     bookId: "category callNo bookTitle"
        // }

        // const populateString = Object.entries(populate).map(
        //     ([path, select]) => ({
        //         path,
        //         select,
        //     })
        // );

        const loanHistory = await paginate(
            loanModel,
            filter,
            page,
            10,
            "dueDate"
            // populateString
        )

        fMsg(res, "Loan History " , loanHistory, 200)

    }catch(error){
        console.log("loan history error " + error)
        next(error)
    }
}