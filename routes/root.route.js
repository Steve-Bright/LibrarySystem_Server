import express from "express";
import { register } from "../controllers/root.controller.js"
import { isRoot, validateToken} from "../utils/validator.js"

const router = express.Router();

router.post("/registerAccount", validateToken(), isRoot(), register);

export default router;