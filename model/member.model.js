import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    memberType: {
        type: String,
        enum: ["student", "teacher", "staff"],
        required: true
    },
    department: {
        type: String,
        index: true, 
        enum: ["Chinese", "English"]
    },
    personalId: {
        type: String,
        required: true,
        unique: true,
        index: true 
    },
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
        unique: true
    },
    gender: {
        type: String, 
        enum: ["male", "female"],
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
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
        required: true,
        type: Date,
    },
    extendDate: {
        type: Date
    },
    expiryDate: {
        required: true,
        type: Date
    },
    note: {
        type: String
    },
    block: {
        type: Boolean,
        default: false
    },
    barcode: {
        required: true,
        type: String
    }
});

export default mongoose.model("Member", memberSchema);
