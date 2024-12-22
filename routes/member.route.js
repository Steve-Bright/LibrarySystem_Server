import express from "express"
import { moveImage } from "../controllers/book.controller.js"
import { addMember, checkBannedMembers, deleteMember, editMember, extendMembership, getAllMembers, getLatestMemberId, getMember, toggleBanMember, searchMember } from "../controllers/member.controller.js"
import {validateToken, isManager, validateBody} from "../utils/validator.js"
import {MemberSchema} from "../utils/data.entry.js"
import { upload } from "../multerStorage.js"

const router = express.Router()

router.post("/addMember", validateToken(),  upload.fields([{name: "photo"}, {name: "barcode"}]), validateBody(MemberSchema.register),
            (req, res, next) => addMember(req, res, next).then((fileDirectory) => moveImage(fileDirectory, req.fileNames))
        )
router.put("/editMember", validateToken(), isManager(), upload.single("photo"), 
            (req, res, next) => editMember(req, res, next).then((fileDirectory) => moveImage(fileDirectory, req.fileNames))
        )
router.get("/getAllMembers", validateToken(), getAllMembers)
router.get("/getMember", validateToken(), getMember)
router.post("/banMember", validateToken(), isManager(), toggleBanMember)
router.delete("/deleteMember", validateToken(), isManager(), deleteMember )
router.post("/extendMembership/:memberDatabaseId", validateToken(), isManager(), extendMembership)
router.get("/getLatestAccNo/:memberType", validateToken(), getLatestMemberId);
router.get("/checkBannedMembers", validateToken(), checkBannedMembers)
router.post("/searchMember", validateToken(), searchMember)
export default router;