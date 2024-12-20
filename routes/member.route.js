import express from "express"
import { moveImage } from "../controllers/book.controller.js"
import { addMember, deleteMember, getMember } from "../controllers/member.controller.js"
import {validateToken, isManager, validateBody} from "../utils/validator.js"
import {MemberSchema} from "../utils/data.entry.js"
import { upload } from "../multerStorage.js"

const router = express.Router()

router.post("/addMember", validateToken(),  upload.fields([{name: "photo"}, {name: "barcode"}]), validateBody(MemberSchema.register),
            (req, res, next) => addMember(req, res, next).then((fileDirectory) => moveImage(fileDirectory, req.fileNames))
        )

router.get("/getMember", validateToken(), getMember)
router.delete("/deleteMember", validateToken(), isManager(), deleteMember )

export default router;