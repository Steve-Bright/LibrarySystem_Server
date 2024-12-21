import mongoose from "mongoose"

const bannedMemberSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true
    }, 
    banUntil: {
        type: Date,
        required: true
    }
})

export default mongoose.model("bannedMember", bannedMemberSchema)