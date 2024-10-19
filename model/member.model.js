import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    memberId: {
        type: String,
        required: true,
        index: true,
        unique: true
    }, 
    name: {
        type: String, 
        required: true,
        index: true
    },
    nrc: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String, 
        enum: ["male", "female"],
        required: true
    },
    memberType: {
        type: String,
        enum: ["student", "teacher", "staff"],
        required: true
    },
    department: {
        type: String,
        required: true,
        index: true, 
        enum: ["Chinese", "English"]
    },
    studentId: {
        type: String,
        unique: true,
        index: true 
    },
    phone: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    permanentAddress: {
        required: true,
        type: String,
    },
    currentAddress: {
        required: true,
        type: String
    },
    photo: {
        required: true,
        type: String
    },
    issueDate: {
        type: Date,
    },
    expiryDate: {
        type: Date
    },
    note: {
        type: String
    },
    block: {
        type: Boolean,
        default: false
    },
});

export default mongoose.model("Member", memberSchema);
