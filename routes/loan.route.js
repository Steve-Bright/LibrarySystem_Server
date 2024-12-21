import express from "express";
import { addLoan, checkLoan } from "../controllers/loan.controller.js";
import { validateToken, isManager } from "../utils/validator.js"


const router = express.Router()

router.post("/addLoan", validateToken(), addLoan)
router.get("/checkLoan", validateToken(), checkLoan)

export default router;