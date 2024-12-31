import express from "express";
import { addLoan, checkLoan, deleteLoan, returnLoan, searchLoan, extendLoan, getAllLoans, getLoanDetail} from "../controllers/loan.controller.js";
import { validateToken, isManager } from "../utils/validator.js"
import { validate } from "node-cron";


const router = express.Router()

router.post("/addLoan", validateToken(), addLoan)
router.get("/checkLoan", validateToken(), checkLoan)
router.post("/returnLoan/:loanId", validateToken(), returnLoan)
router.delete("/deleteLoan/:loanId", validateToken(), deleteLoan)
router.post("/searchLoan", validateToken(), searchLoan)
router.post("/extendLoan/:loanId", validateToken(), extendLoan)
router.get("/getAllLoans", validateToken(), getAllLoans)
router.get("/getLoan/:loanId", validateToken(), getLoanDetail)
export default router;