import express from "express";
import { addLoan, checkLoan, deleteLoan, returnLoan, searchLoan, extendLoan, getAllLoans, getLoanDetail, getTodayDeadlineLoan, getWeeklyLoans, getMonthlyLoans, getLoanHistory, numOfLoans} from "../controllers/loan.controller.js";
import { validateToken, isManager } from "../utils/validator.js"


const router = express.Router()

router.post("/addLoan", validateToken(), addLoan)
router.get("/checkLoan", validateToken(), checkLoan)
router.post("/returnLoan/:loanId", validateToken(), returnLoan)
router.delete("/deleteLoan/:loanId", validateToken(), deleteLoan)
router.post("/searchLoan", validateToken(), searchLoan)
router.post("/extendLoan/:loanId", validateToken(), extendLoan)
// router.get("/getAllLoans", validateToken(), getAllLoans)
router.get("/getAllLoans", validateToken(), getAllLoans)
router.get("/getLoan/:loanId", validateToken(), getLoanDetail)
router.get("/todayLoans", validateToken(), getTodayDeadlineLoan)
router.get("/weeklyLoans", validateToken(), getWeeklyLoans)
router.get("/monthlyLoans", validateToken(), getMonthlyLoans)
router.get("/loanHistory", validateToken(), getLoanHistory)
router.get("/totalNum/:duration", validateToken(), numOfLoans)
export default router;