import express from "express"
import { deleteImage, editImage, moveImage } from "../controllers/book.controller.js"
import { addMember, checkBannedMembers, deleteMember, editMember, extendMembership, getAllMembers, getLatestMemberId, getMember, toggleBanMember, searchMember, getMemberLoanHistory, numOfMembers, checkBanUntil } from "../controllers/member.controller.js"
import {validateToken, isManager, validateBody} from "../utils/validator.js"
import {MemberSchema} from "../utils/data.entry.js"
import { upload } from "../multerStorage.js"

const router = express.Router()

router.post("/addMember", validateToken(),  upload.fields([{name: "photo"}, {name: "barcode"}]), validateBody(MemberSchema.register),
            (req, res, next) => addMember(req, res, next).then((fileDirectory) => moveImage(fileDirectory, req.fileNames))
        )
router.put("/editMember", validateToken(), isManager(), upload.single("photo"), validateBody(MemberSchema.edit),
            (req, res, next) => editMember(req, res, next).then((fileDirectory) => editImage(fileDirectory, req.fileNames))
        )
router.get("/getAllMembers", validateToken(), getAllMembers)
router.get("/getMember", validateToken(), getMember)
router.get("/allLoans/:memberId", validateToken(), getMemberLoanHistory)
router.post("/banMember", validateToken(), isManager(), toggleBanMember)
// router.delete("/deleteMember", validateToken(), isManager(), deleteMember )
router.delete("/deleteMember", validateToken(), isManager(), (req, res, next) =>  deleteMember(req, res, next).then((fileNames) => deleteImage(fileNames)))
router.post("/extendMembership/:memberDatabaseId", validateToken(), isManager(), extendMembership)
router.get("/getLatestMemberId/:memberType", validateToken(), getLatestMemberId);
router.get("/checkBannedMembers", validateToken(), checkBannedMembers)
router.post("/searchMember", validateToken(), searchMember)
router.get("/totalNum/:duration", validateToken(), numOfMembers)
router.get("/checkBanUntil/:id", validateToken(), checkBanUntil)
export default router;