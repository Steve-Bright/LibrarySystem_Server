import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true,
        index: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "bookModel",
        required: true,
        index: true
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
        required: true,
        index: true
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
