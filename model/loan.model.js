import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    memberDatabaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        index: true
    },
    bookDatabaseId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "bookModel",
        index: true
    },
    bookModel: {
        type: String,
        required: true,
        enum: ["engbook", "mmbook"]
    },
    accNo: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["english", "myanmar"],
        required: true
    },
    callNo: {
        type: String,
        required: true
    },
    bookTitle: {
        type: String,
        required: true
    },
    bookCover: {
        type: String,
        required: true
    },
    memberId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }, 
    memberType: {
        type: String,
        enum: ["student", "teacher", "staff", "public"],
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    loanDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
        index: true
    },
    returnDate: {
        type: Date
    },
    duration: {
        type: String, 
        required: true
    },
    loanStatus: {
        type: Boolean,
        default: false,
        index: true
    },
    overdue: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

export default mongoose.model("loan", loanSchema);
