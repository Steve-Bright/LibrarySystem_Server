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
        let memberType = memberFound.memberType

        let duration; 
        let dueDate;
        switch (memberType) {
            case "student": 
                duration = "1 week";
                dueDate = todayDate(7)
                break;
            case "teacher": 
                duration =  "2 week"
                dueDate = todayDate(14)
                break;
            case "staff": 
                duration = "3 week"
                dueDate = todayDate(21)
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

// export const checkLoan = async(req, res, next) => {
//     try{
//         const job = cron.schedule('*/2 * * * *', async () => {
//             // await member.findByIdAndUpdate(memberDatabaseId, { block: false });
//             const overdueBook = await loanModel.findById(bookLoan._id)
//             if(todayDate() > overdueBook.dueDate && loanStatus == true){
//                 overdueBook.overdue = true;
//                 await overdueBook.save();
//             }
//             job.cancel(); // Stop the job after execution
//         });
//     }catch(error){
//         console.log("check loan error " + error);
//         next(error);
//     }
// }