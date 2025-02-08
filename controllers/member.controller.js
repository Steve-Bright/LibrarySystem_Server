import member from "../model/member.model.js"
import bannedMemberModel from "../model/banmember.model.js"
import {fMsg, fError, todayDate, nextYear, paginate, getAnotherMonth} from "../utils/libby.js"
import { kayinGyiMembers, kayinGyiMembersBarcode, kayinGyiTemp } from "../utils/directories.js"
import { mapMember } from "../utils/model.mapper.js"

export const addMember = async(req, res, next) => {
    try{
        const {
            memberType, 
            department,
            grade,
            personalId,
            memberId, 
            name, 
            nrc, 
            gender,
            phone,
            email,
            permanentAddress,
            currentAddress,
            note,
            expireMonths = 5
        } = req.body



        let duplicatePersonalId = await member.findOne({personalId})
        if(duplicatePersonalId){
            return fError(res, "Personal id has already been used as a library member")
        }


        let duplicateMemberId = await member.findOne({memberId})
        if(duplicateMemberId){
            return fError(res, "Member id is already registered")
        }


        if(nrc){
            let duplicateNRC = await member.findOne({nrc})
            if(duplicateNRC){
                return fError(res, "Nrc already is registered")
            }
        }

        if(!req.files.photo){
            return fError(res, "Please upload a member photo" ,400)
        }

        if(!req.files.barcode){
            return fError(res, "Error: No barcode is generated", 400)
        }


        let issueDate = todayDate();
        let expiryDate = getAnotherMonth(expireMonths)

        const fileName = memberId + "-" + Date.now() + ".png"
        const barcodeName = memberId + "-barcode-" + Date.now() + ".png"
        const memberPhoto = "/KayinGyi/members/" + fileName
        const barcode = "/KayinGyi/membersBarcodes/" + barcodeName
        const actualMemberPhoto = kayinGyiMembers + fileName
        const actualMemberBarcode = kayinGyiMembersBarcode + barcodeName
        const memberData = mapMember({
            memberType, 
            grade,
            personalId,
            memberId, 
            name, 
            nrc, 
            gender,
            phone,
            email,
            permanentAddress,
            currentAddress,
            photo: memberPhoto,
            issueDate,
            expiryDate,
            note,
            barcode
        })
        
        const newMember = new member(memberData)

        await newMember.save();
        fMsg(res, "Member is created successfully", newMember, 200)
        return [actualMemberPhoto, actualMemberBarcode]
    }catch(error){
        console.log("adding member error " + error)
        next(error)
    }
}

export const editMember = async(req, res, next) => {
    try{
        const {
            memberType, 
            memberDatabaseId,
            grade,
            personalId,
            memberId, 
            name, 
            nrc, 
            gender,
            phone,
            email,
            permanentAddress,
            currentAddress,
            note,
            editedPhoto
        } = req.body

        
        const memberFound = await member.findById(memberDatabaseId)
        const memberIdFound = memberFound.memberId;
        if(!memberFound){
            return fError(res, "Member is not found", 404)
        }

        const samePersonalId = await member.findOne({personalId})
        if(samePersonalId){
            return fError(res, "There is already duplicate personal id")
        }

        const sameMemberId = await member.findOne({memberId})
        if(sameMemberId){
            return fError(res, "There is already duplicate member id ")
        }

        if(nrc){
            const sameNrc = await member.findOne({nrc})
            if(sameNrc){
                return fError(res, "There is already duplicate nrc")
            }
        }

        if(email){
            const sameEmail = await member.findOne({email})
            if(sameEmail){
                return fError(res, "There is already same email")
            }   
        }

        const samePhone = await member.findOne({phone})
        if(samePhone){
            return fError(res, "There is already same phone number")
        }

        let fileName;
        let memberPhoto
        let actualMemberPhoto
        if(editedPhoto && req.file){
            fileName = memberIdFound + "-" + Date.now() + ".png"
            memberPhoto = "/KayinGyi/members/" + fileName
            actualMemberPhoto = kayinGyiMembers + fileName
        }

        const updatedMember = await member.findByIdAndUpdate(memberDatabaseId, {
            memberType, 
            grade,
            personalId,
            memberId, 
            name, 
            nrc, 
            gender,
            phone,
            email,
            permanentAddress,
            currentAddress,
            photo: memberPhoto,
            note
        }, {new: true})

        await updatedMember.save();
        fMsg(res, "Member is edited successfully", updatedMember, 200)
        return [actualMemberPhoto]

    }catch(error){
        console.log("edit member error " + error)
        next(error)
    }
}

export const getMember = async(req, res, next) => {
    try{
        const { memberDatabaseId, memberId, personalId } = req.query;

        if(!memberDatabaseId && !memberId && !personalId){
            return fError(res, "Please specify the required field")
        }

        let memberData = { }

        if(memberDatabaseId){
            memberData["_id"] = memberDatabaseId
        }
        if(memberId){
            memberData["memberId"] = memberId
        }
        if(personalId){
            memberData["personalId"] = personalId
        }

        const memberFound = await member.findOne(memberData)
        if(!memberFound){
            return fError(res, "There is no such member", 404)
        }

        fMsg(res, "Member fetched successfully", memberFound, 200)
    }catch(error){
        console.log("get member error " + error)
        next(error)
    }
}

export const getAllMembers = async(req, res, next) => {
    try{
        const {memberType, page } = req.query;
        let filter = {};
        if(memberType){
            filter = {memberType}
        }
        const members = await paginate(member, null, page, 10, "createdAt")
        fMsg(res, "Members fetched successfully", members, 200)
    }catch(error){
        console.log('get all members ' + error)
        next(error)
    }
}

export const deleteMember = async(req, res, next) => {
    try{
        const {memberDatabaseId} = req.query;
        if(!memberDatabaseId){
            return fError(res, "Please enter the member", 400)
        }

        const deletedMember = await member.findByIdAndDelete(memberDatabaseId)
        if(!deletedMember){
            return fError(res, "Member to be deleted is not found", 200)
        }

        fMsg(res, "Member deleted successfully", deletedMember, 200)
    }catch(error){
        console.log("delete member error " + error)
        next(error)
    }
}

export const getLatestMemberId = async(req, res, next) => {
    try{
        const memberType = req.params.memberType;
        if(!memberType){
            return fError(res, "No member type found", 404)
        }
        let prefix;
        switch (memberType){
            case "teacher": prefix = "T" 
            break;
            case "student": prefix = "S"
            break;
            case "staff": prefix = "ST"
            break;
            default: 
                return fError(res, "Wrong memberType value")
        }
        let memberId;
        const latestMember = await member.findOne({memberType}).sort({_id: -1})
        if(latestMember){
            let number = latestMember.memberId.split("-")
            number = Number(number[1])+1
            let totalNumber = 5;
            let finalNumber = String(number);
            for(let i = finalNumber.length; i < totalNumber; i++){
                finalNumber = "0" + finalNumber;
            }
            memberId = `${prefix}-${finalNumber}`;
        }else{
            memberId = `${prefix}-00001`;
        }
        fMsg(res, "Latest Member Id", memberId, 200)
    }catch(error){
        console.log("get latest member id error " + error)
        next(error)
    }
}

export const toggleBanMember = async(req, res, next) => {
    try{
        const {memberDatabaseId, block} = req.query;

        if(!memberDatabaseId){
            return fError(res, "Please enter the required field")
        }

        if(!block){
            return fError(res, "Please choose whether you ban or not")
        }

        const memberFound = await member.findById(memberDatabaseId)
        if(!memberFound){
            return fError(res, "Member not found")
        }

        if(memberFound.block == false && block == "false"){
            return fError(res, "Member is already unbanned")
        }else if(memberFound.block == true && block == "true"){
            return fError(res, "Member is already banned")
        }

        const bannedMember = await member.findByIdAndUpdate(memberDatabaseId, {block}, {new: true})
        if(bannedMember.block == false){
            await bannedMemberModel.findByIdAndDelete(bannedMember._id)
            return fMsg(res, "Member is unbanned", bannedMember, 200)
        }else if(bannedMember.block == true){
            await bannedMemberModel.create({
                memberId: bannedMember._id,
                banUntil: todayDate(30)
            })
            return fMsg(res, "Member is banned", bannedMember, 200)
        }

    }catch(error){
        console.log("ban member error" + error)
        next(error)
    }
}

export const extendMembership = async (req, res, next) => {
    try{
        const memberDatabaseId = req.params.memberDatabaseId;
        let today = todayDate()
        let expiryDate = nextYear();
        if(!memberDatabaseId){
            return fError(res, "Member id not found")
        }

        const memberFound =  await member.findById(memberDatabaseId)
        let rightNow = new Date()
        if( rightNow < memberFound.expiryDate){
            return fError(res, `You can't extend member until ${memberFound.expiryDate}`)
        }
        const newMembership = await member.findByIdAndUpdate(memberDatabaseId, {
            $push: {extendDate: today},
            expiryDate
        }, {new: true})

        fMsg(res, "Membership extended successfully", newMembership, 200)

    }catch(error){
        console.log("extending membership error " + error)
        next(error)
    }
}

export const checkBannedMembers = async(req, res, next) => {
    try{
        const bannedMembers = await bannedMemberModel.find({ banUntil: { $lt: todayDate() } });

        for (const bannedMember of bannedMembers) {
            await member.findByIdAndUpdate(bannedMember.memberId, { block: false });
            await bannedMemberModel.findByIdAndDelete(bannedMember._id);
            // console.log(`Member ${bannedMember.memberId} is unbanned`);
        }

        fMsg(res, "Member banned is checked successfully", bannedMembers, 200)
    }catch(error){
        console.log("check banned members error " + error);
        next(error)
    }
}

export const searchMember = async(req, res, next) => {
    try{
        const {memberType, name, memberId, personalId} = req.body;

        if(!memberType && !name && !memberId && !personalId){
            return fError(res, "Please specify at least one field")
        }
        
        if(memberType){
            if(memberType!= "teacher" && memberType != "student" && memberType != "staff"){
                return fError(res, "Wrong memberType values")
            }
        }

        let searchFields = {}
        if(memberType){
            searchFields["memberType"] = memberType
        }

        if(name){
            searchFields["name"] =  { $regex: name, $options: 'i' };
        }

        if(memberId){
            searchFields["memberId"] = { $regex: memberId, $options: 'i' };
        }

        if(personalId){
            searchFields["personalId"] = { $regex: personalId, $options: 'i' };
        }


        const memberFound = await member.find(searchFields)
        if(memberFound.length === 0){
            return fError(res, "Member is not found")
        }

        fMsg(res, "Member is found", memberFound, 200)
    }catch(error){
        console.log("search member error " + error)
        next(error)
    }
}