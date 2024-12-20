import member from "../model/member.model.js"
import {fMsg, fError, todayDate, nextYear} from "../utils/libby.js"
import { kayinGyiMembers, kayinGyiMembersBarcode, kayinGyiTemp } from "../utils/directories.js"

export const addMember = async(req, res, next) => {
    try{
        const {
            memberType, 
            department,
            personalId,
            memberId, 
            name, 
            nrc, 
            gender,
            phone,
            email,
            permanentAddress,
            currentAddress,
            note
        } = req.body

        if(!memberType){
            return fError(res, "Member type is required")
        }

        if(memberType == "teacher" || memberType == "staff"){
            if(!department){
                return fError(res, "Please enter the department")
            }else{
                if(department != "Chinese" && department != "English"){
                    return fError(res, "Please enter the correct department")
                }
            }

            if(!nrc){
                return fError(res, "Please enter the nrc")
            }

            if(!email){
                return fError(res, "Please enter the email")
            }
        }

        if(!personalId){
            return fError(res, "Please enter the related personal id, i.e, student id, teacher id or staff id")
        }else{
            let duplicateMember = await member.findOne({personalId})
            if(duplicateMember){
                return fError(res, "Personal id has already been used as a library member")
            }
        }

        if(!memberId){
            return fError(res, "Please enter the member Id")
        }else{
            let duplicateMember = await member.findOne({memberId})
            if(duplicateMember){
                return fError(res, "Member id is already registered")
            }
        }

        if(!name){
            return fError(res, "Please enter the name")
        }
        
        if(!gender){
            return fError(res, "Please enter the gender")
        }else{
            if(gender != "male" && gender != "female"){
                return fError(res, "Wrong gender input")
            }
        }

        if(!permanentAddress || !currentAddress){
            return fError(res, "Please enter the permanent and current address")
        }

        if(!phone){
            return fError(res, "Please enter the phone")
        }

        if(email){
            let duplicateMember = await member.findOne({email})
            if(duplicateMember){
                return fError(res, "Email already registered")
            }
        }

        if(nrc){
            let duplicateMember = await member.findOne({nrc})
            if(duplicateMember){
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
        let expiryDate = nextYear()

        const fileName = memberId + "-" + Date.now() + ".png"
        const barcodeName = memberId + "-barcode-" + Date.now() + ".png"
        const memberPhoto = "/KayinGyi/members/" + fileName
        const barcode = "/KayinGyi/membersBarcodes/" + barcodeName
        const actualMemberPhoto = kayinGyiMembers + fileName
        const actualMemberBarcode = kayinGyiMembersBarcode + barcodeName
        const newMember = new member({
            memberType, 
            department,
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

        await newMember.save();
        fMsg(res, "Member is created successfully", newMember, 200)
        return [actualMemberPhoto, actualMemberBarcode]
        // if(memberType == "student")
    }catch(error){
        console.log("adding member error " + error)
        next(error)
    }
}

export const editMember = async(req, res, next) => {
    try{

    }catch(error){

    }
}

export const deleteMember = async(req, res, next) => {
    try{
        const {memberId} = req.query;
        if(!memberId){
            return fError(res, "Please enter the member", 400)
        }

        const deletedMember = await member.findByIdAndDelete(memberId)
        if(!deletedMember){
            return fError(res, "Member to be deleted is not found", 200)
        }

        fMsg(res, "Member deleted successfully", deletedMember, 200)
    }catch(error){
        console.log("delete member error " + error)
        next(error)
    }
}