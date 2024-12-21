import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "bookModel",
        required: true
    },
    bookModel: {
        type: String,
        required: true,
        enum: ["engbook", "mmbook"]
    },
    loanDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    duration: {
        type: String, 
        required: true
    },
    loanStatus: {
        type: Boolean,
        default: false
    },
    overdue: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model("loan", loanSchema);
