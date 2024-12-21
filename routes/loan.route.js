import express from "express";
import { addLoan, checkLoan, returnLoan } from "../controllers/loan.controller.js";
import { validateToken, isManager } from "../utils/validator.js"
import { validate } from "node-cron";


const router = express.Router()

router.post("/addLoan", validateToken(), addLoan)
router.get("/checkLoan", validateToken(), checkLoan)
router.post("/returnLoan/:loanId", validateToken(), returnLoan)
export default router;