import express from "express";
import { addLoan } from "../controllers/loan.controller.js";
import { validateToken, isManager } from "../utils/validator.js"


const router = express.Router()

router.post("/addLoan", validateToken(), addLoan)

export default router;